/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider-client-factory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  RedisClientIoRedisV1,
} from '../client-io-redis';

import {
  RedisClientNodeRedisV1,
} from '../client-node-redis';

import {
  IRedisClientIoRedisConfigurationV1,
  IRedisClientNodeRedisConfigurationV1,
  IRedisClientConfigurationV1,
} from '../types';

const REDIS_TYPE = {
  NODE_REDIS: 'redis',
  IO_REDIS: 'ioredis'
}

const createRedisClientNodeRedisV1 = async (
  configuration: IRedisClientNodeRedisConfigurationV1,
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, {
        configuration
      });
    }
    const RET_VAL = new RedisClientNodeRedisV1(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createRedisClientNodeRedisV1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createRedisClientIoRedisV1 = async (
  configuration: IRedisClientIoRedisConfigurationV1,
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Missing configuration required parameter! [EMPTY, NULL, UNDEFINED]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, {
        configuration
      });
    }
    const RET_VAL = new RedisClientIoRedisV1(configuration);
    await RET_VAL.initialize();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createRedisClientIoRedisV1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createRedisClient = async (
  configuration: IRedisClientConfigurationV1,
) => {
  try {
    const CLIENT_TYPE = configuration?.type;
    if (
      lodash.isEmpty(CLIENT_TYPE)
    ) {
      const MESSAGE = 'Missing required configuration.type parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const MESSAGE_UNKNOWN_REDIS_TYPE = `Unsupported redis client type! [Actual: ${CLIENT_TYPE}]`;
    let retVal;

    switch (CLIENT_TYPE) {
      case REDIS_TYPE.NODE_REDIS:
        retVal = await createRedisClientNodeRedisV1(configuration as IRedisClientNodeRedisConfigurationV1);
        break;
      case REDIS_TYPE.IO_REDIS:
        retVal = await createRedisClientIoRedisV1(configuration as IRedisClientIoRedisConfigurationV1);
        break;
      default:
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE_UNKNOWN_REDIS_TYPE);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createRedisClient.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const createRedisClients = async (
  configurations: Array<IRedisClientConfigurationV1>,
) => {
  try {
    if (
      !lodash.isArray(configurations)
    ) {
      const MESSAGE = 'Wrong type of provided parameter configurations! [Expected: Array]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, {
        configurations
      });
    }
    const PROMISES = [];
    for (const CONFIGURATION of configurations) {
      PROMISES.push(createRedisClient(CONFIGURATION));
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createRedisClients.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  createRedisClient,
  createRedisClients,
}
