/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-redis-client-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

const redisAdapter = require('@socket.io/redis-adapter');

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';


import {
  getConfiguration,
  setConfigurationProvider,
  Configurator,
} from './lib/configuration';

import * as redisClientFactory from './lib/factory';

import {
  addManyToRegistryByName,
  addManyToRegistryByIdAndHash,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
  touchOneByIdAndHash,
} from './lib/registry';

import {
  RedisClientNodeRedisV1,
} from './lib/client-node-redis';

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (
  path = DEFAULT_CONFIG_PATH,
) => {
  try {
    const CONFIG_ROOT = getConfiguration();
    const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
    if (
      lodash.isEmpty(CONFIG_PROVIDER)
    ) {
      const MESSAGE = `Missing ${DEFAULT_CONFIG_PATH} configuration`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const CONFIG_CLIENTS = CONFIG_PROVIDER?.clients;

    const CLIENTS = await redisClientFactory.createRedisClients(CONFIG_CLIENTS);

    addManyToRegistryByName(CLIENTS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByRootConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (
  provider: any,
  path = DEFAULT_CONFIG_PATH,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
    await initManyByRootConfiguration(path);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initByConfigurationProvider', {
      ACA_ERROR
    });
    throw ACA_ERROR;
  }
}

const _extractNewClients = (
  clients: Array<any>,
) => {
  try {
    const RET_VAL = [];
    if (
      lodash.isArray(clients) &&
      !lodash.isEmpty(clients)
    ) {
      for (const CLIENT of clients) {
        const EXISTS = touchOneByIdAndHash(CLIENT);
        if (
          !EXISTS
        ) {
          RET_VAL.push(CLIENT)
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_extractNewClients.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initManyByTenant = async (
  params: {
    tenant?: any,
  }
) => {
  const TENANT = params?.tenant;
  try {
    const CONFIG_CLIENTS = TENANT?.redisClients;
    const CONFIG_CLIENTS_NEW = _extractNewClients(CONFIG_CLIENTS);
    if (
      !lodash.isEmpty(CONFIG_CLIENTS_NEW)
    ) {
      const CLIENTS = await redisClientFactory.createRedisClients(CONFIG_CLIENTS_NEW);
      await addManyToRegistryByIdAndHash(CLIENTS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, {
      ACA_ERROR
    });
    throw ACA_ERROR;
  }
}

const getRedisClient = (
  id = 'default',
  hash = undefined,
) => {
  let retVal;
  if (
    !lodash.isEmpty(id) &&
    !lodash.isEmpty(hash)
  ) {
    retVal = getOneByIdAndHash(id, hash);
  } else {
    retVal = getOneById(id);
  }
  return retVal;
}

const getRedisClientNodeRedis = (
  id = 'default',
  hash = undefined,
): RedisClientNodeRedisV1 => {
  const RET_VAL = getRedisClient(id, hash);
  return RET_VAL as RedisClientNodeRedisV1;
}

const getRedisClients = () => {
  return getRegistry();
}

const getSocketIORedisAdapter = (id = 'default') => {
  const REDIS_CLIENT = ramda.path(['client'], getOneById(id));
  let retVal;
  if (
    !lodash.isEmpty(REDIS_CLIENT)
  ) {
    const PUB_CLIENT = REDIS_CLIENT;
    const SUB_CLIENT = REDIS_CLIENT.duplicate();
    const ADAPTER = redisAdapter.createAdapter(PUB_CLIENT, SUB_CLIENT);
    retVal = ADAPTER;
  } else {
    logger.warn(`Redis client: '${id}' not found in clients: [${Object.keys(getRegistry())}]`);
  }
  return retVal;
}

export {
  RedisClientNodeRedisV1,
  //
  initByConfigurationProvider,
  initManyByTenant,
  redisClientFactory,
  getRedisClient,
  getRedisClientNodeRedis,
  getRedisClients,
  getSocketIORedisAdapter,
};
