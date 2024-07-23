/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-client-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

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

import {
  createObjectStorageClients,
  createObjectStorageClient,
} from './lib/client-factory';

import {
  addManyToRegistryByName,
  addOneToRegistryByIdAndHash,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
  touchOneByIdAndHash,
} from './lib/client-registry';

import {
  ObjectStorageClient,
} from './lib/client';

import {
  IObjectStorageClientConfigurationV1,
} from './lib/types';

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (path = DEFAULT_CONFIG_PATH) => {
  try {
    const CONFIG_ROOT = getConfiguration();
    const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
    if (
      lodash.isEmpty(CONFIG_PROVIDER)
    ) {
      const MESSAGE = `Missing ${DEFAULT_CONFIG_PATH} configuration`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const CONFIG_CLIENTS = ramda.path(['clients'], CONFIG_PROVIDER);
    const CLIENTS = await createObjectStorageClients(CONFIG_CLIENTS);
    addManyToRegistryByName(CLIENTS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByRootConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (provider, path = DEFAULT_CONFIG_PATH) => {
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
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initOneByTenant = async (
  params: {
    tenant?: {
      objectStorage?: any
    }
  }
) => {
  const TENANT = params?.tenant;
  try {
    const CONFIG_CLIENT = TENANT?.objectStorage;
    const EXISTS = touchOneByIdAndHash(CONFIG_CLIENT);
    if (
      !EXISTS
    ) {
      const CLIENT = await createObjectStorageClient(CONFIG_CLIENT);
      await addOneToRegistryByIdAndHash(CLIENT);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initOneByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getObjectStorageClientByTenant = (
  tenant: any,
): ObjectStorageClient<IObjectStorageClientConfigurationV1> => {
  let retVal;
  const OBJECT_STORAGE_CONFIG = tenant?.objectStorage;

  const id = OBJECT_STORAGE_CONFIG?.id;
  const hash = OBJECT_STORAGE_CONFIG?.hash;
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

const getObjectStorageClients = () => {
  return getRegistry();
}

export {
  initByConfigurationProvider,
  initOneByTenant,
  getObjectStorageClientByTenant,
  getObjectStorageClients,
};
