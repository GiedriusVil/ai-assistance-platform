/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-client-redis';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

const redis = require('redis');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';


import {
  IRedisClientNodeRedisConfigurationV1,
  RedisClientV1,
} from '../types';

const onError = (
  configuration: any,
) => {
  const RET_VAL = (error) => {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.configuration = configuration;
    logger.error(onError.name, { ACA_ERROR });
  }
  return RET_VAL;
}

const onConnect = (
  configuration: any,
) => {
  const RET_VAL = () => {
    const MESSAGE = `[${MODULE_ID}] Connected to redis!`;
    logger.info(MESSAGE, { configuration });
  };
  return RET_VAL;
}

const onReconnecting = (
  configuration: any,
) => {
  const RET_VAL = (
    options: any,
  ) => {
    logger.warn('[REDIS] Reconnecting...', { configuration, options });
  }
  return RET_VAL;
}

const retryStrategy = (
  options: {
    attempt: number,
    error: any,
  }
) => {
  logger.warn(`[REDIS][WARN] Redis retry_strategy attempt [${options.attempt}]`);
  const OPTIONS_ERROR_CODE = options?.error?.code;
  if (
    OPTIONS_ERROR_CODE === 'ECONNREFUSED'
  ) {
    // Logs errors with codes that client.on("error") does not handle, but doesn't stop reconnection retry
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, options.error);
    logger.error(retryStrategy.name, ACA_ERROR);
  }
  return Math.min(options.attempt * 100, 3000);
};

class RedisClientNodeRedisV1 extends RedisClientV1<IRedisClientNodeRedisConfigurationV1> {

  constructor(
    configuration: IRedisClientNodeRedisConfigurationV1,
  ) {
    try {
      super(configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize(): Promise<void> {
    try {
      this.client = redis.createClient(this.redisOptions);
      this.redisOptions.retry_strategy = retryStrategy;
      this.client.on('error', onError(this.configuration));
      this.client.on('connect', onConnect(this.configuration));
      this.client.on('reconnecting', onReconnecting(this.configuration));
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.initialize.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async testConnection() {
    try {
      const KEY = `testConnection:${uuidv4()}`;
      const VALUE = uuidv4();

      const SET_PROMISE = new Promise((resolve, reject) => {
        const SET_TIMER = setTimeout(() => {
          reject('SET_TIMER_TIMEOUT');
        }, (2000));
        const SET_CALLBACK = (err, value) => {
          clearTimeout(SET_TIMER);
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        }
        this.client.set(KEY, VALUE, SET_CALLBACK);
      });
      const GET_PROMISE = new Promise((resolve, reject) => {
        const GET_TIMER = setTimeout(() => {
          reject('GET_TIMER_TIMEOUT');
        }, (2000));
        const GET_CALLBACK = (err, value) => {
          clearTimeout(GET_TIMER);
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        }
        this.client.get(KEY, GET_CALLBACK);
      });

      await SET_PROMISE;
      const GET_RESPONSE = await GET_PROMISE;

      const RET_VAL = VALUE === GET_RESPONSE;
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.testConnection.name, { ACA_ERROR });
      throw ACA_ERROR;
    } finally {
      if (this.client) {
        this.client.quit();
      }
    }
  }
}

export {
  RedisClientNodeRedisV1,
}
