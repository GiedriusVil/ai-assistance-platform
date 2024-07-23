/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-client';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IRedisClientConfigurationV1,
} from '..';

import {
  constructOptionsRedis,
} from './construct-options-redis';

abstract class RedisClientV1<E extends IRedisClientConfigurationV1> {

  configuration: E;

  id: string;
  hash: string;
  name: string;

  redisOptions: any;
  redisOptionsClone: any;

  client: any;

  status: any;

  constructor(
    configuration: E,
  ) {
    try {
      if (
        lodash.isEmpty(configuration)
      ) {
        const MESSAGE = 'Missing required configuration parameter!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      this.configuration = configuration;

      this.id = this.configuration?.id;
      this.hash = this.configuration?.hash;
      this.name = this.configuration?.name;

      this.redisOptions = constructOptionsRedis(this.configuration);
      this.redisOptionsClone = lodash.cloneDeep(this.redisOptions);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  abstract initialize(): Promise<void>;

  getName() {
    return this.name;
  }

  getRawClient() {
    return this.client;
  }
}

export {
  RedisClientV1,
}
