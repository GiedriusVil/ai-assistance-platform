/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-mongo-client-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
  getConfiguration,
  Configurator,
} from './lib/configuration';

import {
  AiapMongoClientV1,
} from './lib/client';

import { mongoClientFactory } from './lib/client-factory';

import {
  addManyToRegistryByName,
  addManyToRegistryByIdAndHash,
  closeConnections,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
  touchOneByIdAndHash,
} from './lib/client-registry';

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (
  path = DEFAULT_CONFIG_PATH
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

    const CLIENTS = await mongoClientFactory.createManyAiapMongoClientV1(CONFIG_CLIENTS);
    addManyToRegistryByName(CLIENTS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByRootConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (
  provider: any,
  path = DEFAULT_CONFIG_PATH
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = `Please provide configuration provider! [aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);
    await initManyByRootConfiguration(path);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _extractNewClients = (
  clients: any
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
  params: any
) => {
  const TENANT = params?.tenant;
  try {
    const CONFIG_CLIENTS = TENANT?.dbClients;
    const CONFIG_CLIENTS_NEW = _extractNewClients(CONFIG_CLIENTS);
    if (
      !lodash.isEmpty(CONFIG_CLIENTS_NEW)
    ) {
      const CLIENTS = await mongoClientFactory.createManyAiapMongoClientV1(CONFIG_CLIENTS_NEW);
      await addManyToRegistryByIdAndHash(CLIENTS);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

/**
 * @deprecated -> Use getMongoClient
 */
const getAcaMongoClient = (
  id = 'default',
  hash = undefined
): AiapMongoClientV1 => {
  const RET_VAL = getMongoClient(id, hash);
  return RET_VAL;
}

/**
 * @deprecated -> Use getMongoClients
 */
const getAcaMongoClients = (
  context: IContextV1,
): {
  [key: string]: AiapMongoClientV1
} => {
  return getMongoClients(context);
}

const getMongoClient = (
  id = 'default',
  hash = undefined
): AiapMongoClientV1 => {
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

const getMongoClients = (
  context: IContextV1,
): {
  [key: string]: AiapMongoClientV1
} => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

export {
  initByConfigurationProvider,
  initManyByRootConfiguration,
  initManyByTenant,
  getAcaMongoClient,
  getAcaMongoClients,
  getMongoClient,
  getMongoClients,
  closeConnections,
  mongoClientFactory,
  AiapMongoClientV1,
};
