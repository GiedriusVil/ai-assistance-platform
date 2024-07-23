/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'memory-store-redis';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const Flatted = require('flatted');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getRedisClient,
} from '@ibm-aiap/aiap-redis-client-provider';

import {
  MemoryStoreV1,
  IMemoryStoreV1,
} from '../memory-store';

import {
  IMemoryStoreV1RedisConfiguration,
} from './memory-store-redis-configuration';

export class MemoryStoreV1Redis
  extends MemoryStoreV1<IMemoryStoreV1RedisConfiguration>
  implements IMemoryStoreV1 {

  private keyPrefix: string;
  private redisClient: any;

  private store: any;

  constructor(
    configuration: IMemoryStoreV1RedisConfiguration,
  ) {
    super(configuration);
    this._status = 'offline';
    this.keyPrefix = configuration?.keyPrefix;
    try {
      if (
        lodash.isEmpty(this.keyPrefix)
      ) {
        const ERROR_MESSAGE = 'Missing required configuration.keyPrefix parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE, { configuration });
      }
      this.redisClient = getRedisClient(configuration?.client);
      if (
        lodash.isEmpty(this.redisClient)
      ) {
        const ERROR_MESSAGE = 'Unable to retrieve RedisClient!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE, { configuration });
      }
      this.store = this.redisClient.client;

      this.store.on('connect', () => (this._status = 'online'));
      this.store.on('reconnecting', () => (this._status = 'offline'));
      this.store.on('end', () => (this._status = 'offline'));
      this.store.on('error', () => (this._status = 'offline'));

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
  getStore() {
    return this.store;
  }

  getKeyPrefix(): string {
    return this.keyPrefix;
  }

  getKeyPrefixAbsolute(): string {
    const KEY_PREFIX = this.getKeyPrefix();
    const KEY_PREFIX_REDIS_CLIENT = this.redisClient?.redisOptions?.keyPrefix || 'default:';
    const RET_VAL = `${KEY_PREFIX_REDIS_CLIENT}${KEY_PREFIX}:`;
    return RET_VAL;
  }

  async status() {
    return this._status;
  }

  addTimestamp(
    data: any,
  ) {
    return ramda.mergeRight({ timestamp: new Date().toISOString() }, data);
  }

  _prefixId(id) {
    return `${this.keyPrefix}:${id}`;
  }

  // [2021-11-18] [LEGO] This method is required by orchestrator!
  // [2021-11-18] [LEGO] Cause of strange orchestrator implementation - it requires - to return an object always!
  async getData(
    id: string,
  ) {
    let retVal = await this.get(id);
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = {};
    }
    return retVal;
  }

  get(
    id: string,
  ) {
    let session;
    const RET_VAL = new Promise((resolve, reject) =>
      this.store.get(this._prefixId(id), (err, reply) => {
        if (err) {
          logger.error(`Failed to retrieve cache for ${id}`, { id: 1 });
          return reject(err);
        } else if (reply) {
          if (logger.isDebug()) logger.debug(`Retrieving cache for ${id}`, { id: 2 });
          session = Flatted.parse(reply);
        } else {
          if (logger.isDebug()) logger.debug(`Initiating cache for ${id}`, { id: 3 });
        }
        resolve(session);
      })
    );
    return RET_VAL;
  }

  ttl(
    id: string,
  ) {
    let session;
    const RET_VAL = new Promise((resolve, reject) =>
      this.store.ttl(this._prefixId(id), (err, reply) => {
        if (err) {
          logger.error(`Failed to retrieve ttl for ${id}`, { id: 1 });
          return reject(err);
        } else if (reply) {
          logger.debug?.(`Retrieving ttl for ${id}`, { id: 2 });
          session = reply;
        } else {
          logger.debug?.(`Initiating ttl for ${id}`, { id: 3 });
        }
        resolve(session);
      })
    );
    return RET_VAL;
  }

  exists(
    id: string,
  ) {
    return this.store.exists(id);
  }

  type() {
    return this._type;
  }

  // This method is required by orchestrator!
  setData(
    id: string,
    data: any,
    expiration?: number,
  ) {
    return this.set(id, data, expiration);
  }

  set(
    id: string,
    data: any,
    expiration?: number,
  ) {
    const SERIALIZED = Flatted.stringify(this.addTimestamp(data));
    return new Promise((resolve, reject) => {
      const cb = (err, reply) => {
        if (err) {
          logger.error(`Failed to put into cache for ${id}, ${err}`, { id: 4, err });
          return reject(err);
        } else {
          if (logger.isDebug()) logger.debug(`Updated cache for ${id}, reply ${reply}`, { id: 5 });
          resolve(reply);
        }
      };
      if (expiration) {
        this.store.set(this._prefixId(id), SERIALIZED, 'PX', expiration, cb);
      } else {
        this.store.set(this._prefixId(id), SERIALIZED, cb);
      }
    });
  }

  // This method is required by orchestrator!
  deleteData(
    id: string,
  ) {
    return this.remove(id);
  }

  remove(
    id: string,
  ) {
    const RET_VAL = new Promise((resolve, reject) => {
      const ID_TO_BE_REMOVED = this._prefixId(id);
      this.store.del(ID_TO_BE_REMOVED, (error, reply) => {
        if (error) {
          const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
          logger.error(`Failed to delete from cache for id[${id}]!`, { ACA_ERROR });
          return reject(ACA_ERROR);
        } else {
          if (logger.isDebug()) logger.debug(`Deleted from cache for ${id}, reply ${reply}`, { id: 7 });
          resolve(reply);
        }
      })
    }
    );
    return RET_VAL;
  }

  paternGet(
    id: string,
  ) {
    let session;
    const RET_VAL = new Promise((resolve, reject) =>
      this.store.keys(`*${this._prefixId(id)}*`, (err, reply) => {
        if (err) {
          logger.error(`failed to retrieve cache for ${id}`, { id: 1 });
          return reject(err);
        } else if (reply) {
          if (logger.isDebug()) logger.debug(`retrieving cache for ${id}`, { id: 2 });
          session = reply
        } else {
          if (logger.isDebug()) logger.debug(`initing cache for ${id}`, { id: 3 });
          session = {};
        }
        resolve(session);
      })
    );
    return RET_VAL;
  }

}
