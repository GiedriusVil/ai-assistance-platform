/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-client-ioredis-encrypted';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const crypto = require('crypto');

import ioRedis, { Cluster } from 'ioredis';

import lodash from '@ibm-aca/aca-wrapper-lodash';

const {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError
} = require('@ibm-aca/aca-utils-errors');

import * as utils from './utils';

const encryptWrapper = (
  key,
  hmacKey,
  client
) => {

  const RET_VAL = (...args) => {
    utils.enforceNotEmpty(key, 'You must specify an encryption key');
    utils.enforceNotEmpty(hmacKey, 'You must specify a HMAC encryption key');

    const algo = 'aes-256-ctr';
    const hmacAlgo = 'sha256';

    const constantTimeCompare = (
      val1: any,
      val2: any,
    ) => {
      let sentinel;
      if (
        val1.length !== val2.length
      ) {
        return false;
      }
      for (let i = 0; i <= (val1.length - 1); i++) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
      }
      return sentinel === 0;
    };

    const encrypt = (
      value: any,
    ) => {
      const IV = new Buffer(crypto.randomBytes(16));

      const ENCRYPT = crypto.createCipheriv(algo, key, IV);

      ENCRYPT.setEncoding('hex');
      ENCRYPT['write'](value);
      ENCRYPT.end();

      const CIPHER_TEXT = ENCRYPT.read();

      const HMAC = crypto.createHmac(hmacAlgo, hmacKey);
      HMAC.update(CIPHER_TEXT);
      HMAC.update(IV.toString('hex'));

      return `${CIPHER_TEXT}|${IV.toString('hex')}|${HMAC.digest('hex')}`;
    };

    const decrypt = (
      cipherText: any,
    ) => {
      const CIPHER_BLOB = cipherText.split('|');

      const CT = CIPHER_BLOB[0];
      const IV = new Buffer(CIPHER_BLOB[1], 'hex');
      const HMAC = CIPHER_BLOB[2];

      const CHMAC = crypto.createHmac(hmacAlgo, hmacKey);
      CHMAC.update(CT);
      CHMAC.update(IV.toString('hex'));

      if (
        !constantTimeCompare(CHMAC.digest('hex'), HMAC)
      ) {
        throw new Error('Encrypted Blob has been tampered with.');
      }

      const DECRYPTOR = crypto.createDecipheriv(algo, key, IV);

      const decryptedText = DECRYPTOR.update(CT, 'hex', 'utf8');
      return decryptedText + DECRYPTOR.final('utf-8');
    };

    const redis = new client(...args);
    const encryptCommand = (
      client: any,
      methodName: any,
      item: any,
    ) => {
      const method = client[methodName].bind(client);
      client[methodName] = (...args) => {
        if (Array.isArray(args[0])) {
          args[0][item] = encrypt(args[0][item]);
        } else {
          args[item] = encrypt(args[item]);
        }
        method(...args);
      };
    };
    const decryptResult = (
      client: any,
      methodName: any,
      type?: any,
    ) => {
      const decryptKvp = (result) => {
        Object.keys(result).map(key => {
          result[key] = decrypt(result[key]);
        });
        return result;
      };
      const decryptArray = (result) => {
        return result.map(decrypt);
      };
      const method = client[methodName].bind(client);
      client[methodName] = function (...args) {
        const done = args.pop();

        method(...args, (err, result) => {
          if (err) {
            return done(err);
          }
          if (
            utils.isEmpty(result)
          ) {
            return done(null, result);
          }
          switch (type) {
            case 'object':
              result = decryptKvp(result);
              result = methodName === 'hgetall' && Object.keys(result).length === 0 ? null : result;
              break;
            case 'array':
              result = decryptArray(result);
              break;
            default:
              result = decrypt(result);
          }
          done(null, result);
        });
      };
    };

    const wrapPubSub = (client) => {
      const method = client.on.bind(client);
      client.on = function (...args) {
        const event = args[0];
        const handler = args[1];
        if (
          event === 'message'
        ) {
          return method(event, (channel, msg) => {
            msg = decrypt(msg);
            handler(channel, msg);
          });
        }
        if (
          event === 'pmessage'
        ) {
          return method(event, (filter, channel, msg) => {
            msg = decrypt(msg);
            handler(filter, channel, msg);
          });
        }
        method(...args);
      };
    };

    wrapPubSub(redis);

    const wrapClient = (client) => {
      encryptCommand(client, 'set', 1);
      decryptResult(client, 'get');

      encryptCommand(client, 'lpush', 1);
      decryptResult(client, 'lpop');
      decryptResult(client, 'lrange', 'array');

      encryptCommand(client, 'rpush', 1);
      decryptResult(client, 'rpop');

      encryptCommand(client, 'hset', 2);
      decryptResult(client, 'hget');

      encryptCommand(client, 'publish', 1);
      decryptResult(client, 'hgetall', 'object');
    };
    wrapClient(redis);

    const wrapPipeline = (client) => {
      const pipeline = client.pipeline.bind(client);
      client.pipeline = () => {
        const pipe = pipeline();
        const handlers = [];
        const results = [];

        const exec = pipe.exec.bind(pipe);

        pipe.exec = function (done) {
          exec(err => {
            if (done) {
              done(err, results);
            }
            let result = results.pop();
            while (
              !utils.isEmpty(result) &&
              handlers.length > 0
            ) {
              const original = handlers.pop();
              original(...result);
              result = results.pop();
            }
          });
        };

        const pipeWrap = (methodName) => {
          const method = pipe[methodName].bind(pipe);
          pipe[methodName] = function (...args) {
            const callback = args[args.length - 1];
            let done;
            if (typeof callback === 'function') {
              done = args.pop();
            } else {
              done = () => {
                //
              };
            }
            handlers.push(done);
            method(...args, (err, data) => {
              results.push([err, data]);
            });
          };
        };
        wrapClient(pipe);
        [
          'get',
          'set',
          'lpush',
          'lpop',
          'lrange',
          'rpush',
          'rpop',
          'hset',
          'hget',
          'hgetall'
        ].forEach(pipeWrap);

        return pipe;
      };
    };

    wrapPipeline(redis);
    return redis;
  };

  return RET_VAL;
}

const ioRedisEncrypted = (
  configuration: {
    encryption?: {
      key: any,
      hmacKey: any,
    }
  }
) => {
  try {
    const ENCRYPTION_KEY = configuration?.encryption?.key;
    const ENCRYPTION_HMAC_KEY = configuration?.encryption?.hmacKey;

    if (
      lodash.isEmpty(ENCRYPTION_KEY)
    ) {
      const MESSAGE = 'Missing required config.encryption.key parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ENCRYPTION_HMAC_KEY)
    ) {
      const MESSAGE = 'Missing required config.encryption.hmacKey parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL: any = Object.assign(encryptWrapper(ENCRYPTION_KEY, ENCRYPTION_HMAC_KEY, ioRedis), ioRedis);
    RET_VAL.Cluster = encryptWrapper(ENCRYPTION_KEY, ENCRYPTION_HMAC_KEY, Cluster);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ioRedisEncrypted.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  ioRedisEncrypted,
}
