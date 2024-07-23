/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ibm-secrets-manager-client-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import {
  setConfigurationProvider,
  getConfiguration,
  Configurator,
} from './lib/configuration';

import { AIAPIbmSecretsManagerClient } from './lib/client';

import { clientFactory } from './lib/client-factory';

import {
  addManyToRegistryByName,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
} from './lib/client-registry';

const DEFAULT_CONFIG_PATH = Configurator.NAME;

const initManyByRootConfiguration = async (path = DEFAULT_CONFIG_PATH) => {
  try {
    const CONFIG_ROOT = getConfiguration();

    const CONFIG_PROVIDER = CONFIG_ROOT?.[path];
    if (lodash.isEmpty(CONFIG_PROVIDER)) {
      const MESSAGE = `Missing ${DEFAULT_CONFIG_PATH} configuration`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const CONFIG_CLIENTS = CONFIG_PROVIDER?.clients;
    const CLIENTS = await clientFactory.createClients(CONFIG_CLIENTS);
    addManyToRegistryByName(CLIENTS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByRootConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (provider, path = DEFAULT_CONFIG_PATH) => {
  try {
    if (lodash.isEmpty(provider)) {
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

const getSecretsManagerClient = (id = 'default', hash = undefined) => {
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

const getSecretsManagerClients = (context) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

export {
  initByConfigurationProvider,
  initManyByRootConfiguration,
  getSecretsManagerClient,
  getSecretsManagerClients,
  clientFactory,
  AIAPIbmSecretsManagerClient,
};
