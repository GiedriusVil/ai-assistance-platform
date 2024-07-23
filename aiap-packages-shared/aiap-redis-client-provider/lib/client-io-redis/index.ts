/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-client-io-redis';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';
import { uuidv4 } from '@ibm-aca/aca-wrapper-uuid';

import { URL } from 'url';
const ioRedis = require('ioredis');

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';


import {
  ioRedisEncrypted,
} from './io-redis-encrypted';

import {
  IRedisClientIoRedisConfigurationV1,
  RedisClientV1,
} from '../types';

const retryStrategy = (
  times: number,
) => {
  logger.warn(`[REDIS][WARN] Redis retry_strategy attempt [${times}]`);
  // reconnect after
  return Math.min(times * 100, 3000);
};


class RedisClientIoRedisV1 extends RedisClientV1<IRedisClientIoRedisConfigurationV1> {

  constructor(
    configuration: IRedisClientIoRedisConfigurationV1,
  ) {
    try {
      super(configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', {
        ACA_ERROR
      });
      throw ACA_ERROR;
    }
  }

  async initialize(): Promise<void> {
    try {
      if (
        lodash.isFunction(this.configuration.retryStrategy)
      ) {
        this.redisOptions.retryStrategy = retryStrategy;
      } else {
        logger.info(`[REDIS][INFO] No custom retry strategy`);
        this.redisOptions.retryStrategy = retryStrategy;
      }
      const Redis = this.configuration.encryption ? ioRedisEncrypted(this.configuration) : ioRedis;
      const REDIS_URL = this.configuration?.url;
      const REDIS_CLUSTER = this.configuration?.cluster;
      if (
        REDIS_CLUSTER
      ) {
        logger.info('Setting up cluster!');
        const REDIS_CLUSTURE_NODES = REDIS_CLUSTER.hosts.map(url => {
          const NODE_URL = new URL(url);
          return {
            host: NODE_URL.hostname,
            port: NODE_URL.port
          };
        });
        this.client = new Redis.Cluster(REDIS_CLUSTURE_NODES, {
          redisOptions: this.redisOptions
        });
      } else {
        logger.info('Setting up single server!');
        this.client = new Redis(REDIS_URL, this.redisOptions);
      }
      this.client.on('connect', this.onConnect.bind(this));
      this.client.on('reconnecting', this.onReconnecting.bind(this));
      this.client.on('end', this.onEnd.bind(this));
      this.client.on('error', this.onError.bind(this));
      this.client.on('select', this.onSelect.bind(this));
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.initialize.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  onError(error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      this_configuration: this.configuration
    });
    logger.error(`onError`, {
      ACA_ERROR
    });
    this.status = {
      code: 'offline',
      error: ACA_ERROR
    }
  }

  onConnect(params) {
    this.status = {
      code: 'online',
      params: params
    };
    logger.info(`onConnect`, {
      this_configuration: this.configuration,
      this_status: this.status
    });
  }

  onEnd(params) {
    this.status = {
      code: 'offline',
      params: params
    };
    logger.warn(`onEnd`, {
      this_configuration: this.configuration,
      this_status: this.status
    });
  }

  onReconnecting(delay, attempt) {
    logger.warn('onReconnecting', {
      this_configuration: this.configuration,
      delay: delay,
      attempt: attempt
    });
  }

  onSelect(db) {
    logger.info(`onSelect`, {
      this_configuration: this.configuration,
      db: db
    });
  }

  async testConnection() {
    try {
      const KEY = `testConnection:${uuidv4()}`;
      const VALUE = uuidv4();

      await this.client.set(KEY, VALUE);
      const VALUE_STORED = await this.client.get(KEY);

      const RET_VAL = VALUE === VALUE_STORED;
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('testConnection', {
        ACA_ERROR
      });
      throw ACA_ERROR;
    } finally {
      if (
        this.client
      ) {
        await this.client.quit();
      }
    }
  }

  newIoRedisClient(name) {
    try {
      if (
        lodash.isEmpty(name)
      ) {
        const MESSAGE = 'Missing required name parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      const REDIS_URL = ramda.path(['url'], this.configuration);
      const OPTIONS = lodash.cloneDeep(this.redisOptionsClone);
      const RET_VAL = new ioRedis(REDIS_URL, OPTIONS);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, {
        this_configuration: this.configuration
      });
      logger.error('newIoRedisClient', {
        ACA_ERROR
      });
      throw ACA_ERROR;
    }
  }

}

export {
  RedisClientIoRedisV1,
}
