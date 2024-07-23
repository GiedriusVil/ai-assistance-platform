/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'memory-store-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
  setConfigurationProvider,
} from './lib/configuration';

import {
  IMemoryStoreV1,
} from './lib/memory-store';

import {
  MemoryStoreV1Local,
  IMemoryStoreV1LocalConfiguration,
} from './lib/memory-store-local';

import {
  MemoryStoreV1Redis,
  IMemoryStoreV1RedisConfiguration,
} from './lib/memory-store-redis';

const REGISTRY: {
  [key: string]: IMemoryStoreV1,
} = {};

const MEMORY_STORE_TYPES = {
  REDIS: 'redis',
  LOCAL: 'local'
}

const initMemoryStore = (
  configuration: any,
) => {
  const MEMORY_STORE_NAME = configuration?.name
  const MEMORY_STORE_TYPE = configuration?.type;

  let memoryStore;

  const MESSAGE_UNKNOWN_MEMORY_STORE_TYPE = `Uknown memory store type [${MEMORY_STORE_TYPE}]!`;

  switch (MEMORY_STORE_TYPE) {
    case MEMORY_STORE_TYPES.REDIS:
      memoryStore = new MemoryStoreV1Redis(configuration as IMemoryStoreV1RedisConfiguration);
      break;
    case MEMORY_STORE_TYPES.LOCAL:
      memoryStore = new MemoryStoreV1Local(configuration as IMemoryStoreV1LocalConfiguration);
      break;
    default:
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE_UNKNOWN_MEMORY_STORE_TYPE);
  }
  REGISTRY[MEMORY_STORE_NAME] = memoryStore;
}

const initMemoryStoreProvider = () => {
  const CONFIGURATION = getLibConfiguration();
  if (
    lodash.isObject(CONFIGURATION) &&
    !lodash.isEmpty(CONFIGURATION)
  ) {
    const CONFIGURATION_STORES = CONFIGURATION?.stores;
    if (
      !lodash.isEmpty(CONFIGURATION_STORES) &&
      lodash.isArray(CONFIGURATION_STORES)
    ) {
      for (const CONFIGURATION_STORE of CONFIGURATION_STORES) {
        initMemoryStore(CONFIGURATION_STORE);
      }
    } else {
      logger.warn('Zero memory stores are configured!');
    }
  } else if (
    lodash.isBoolean(CONFIGURATION) &&
    !CONFIGURATION
  ) {
    logger.warn('Memory store explicitly turned off by configuration!');
  } else {
    const ACA_ERROR = {
      type: 'VALIDATION_ERROR',
      message: `[${MODULE_ID}] Misssing required memoryStore configuration`,
    }
    throw ACA_ERROR;
  }
};

const initByConfigurationProvider = async (
  provider: any,
) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'VALIDATION_ERROR',
      message: `[${MODULE_ID}] Misssing required provider parameter!`
    }
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
  initMemoryStoreProvider();
}

const getMemoryStore = (
  name = 'default'
): IMemoryStoreV1 => {
  const RET_VAL = REGISTRY[name];
  return RET_VAL;
};

export {
  initByConfigurationProvider,
  getMemoryStore,
} 
