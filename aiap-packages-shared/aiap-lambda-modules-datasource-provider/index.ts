/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  setConfigurationProvider,
  getConfiguration,
  Configurator
} from './lib/configuration';

import { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } from '@ibm-aca/aca-utils-errors';
import { createAcaLambdaModulesDatasources } from './lib/datasource-factory';
import {
  addManyToRegistryByName,
  addManyToRegistryByIdAndHash,
  getOneById,
  getOneByIdAndHash,
  getRegistry
} from '@ibm-aca/aca-runtime-source-registry';

import {
  IDatasourceLambdaModulesV1,
} from './lib/types';

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (path = DEFAULT_CONFIG_PATH) => {
  const CONFIG_ROOT = getConfiguration();
  const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
  if (
    lodash.isEmpty(CONFIG_PROVIDER)
  ) {
    logger.warn(`[${MODULE_ID}] Disabled by configuration!`);
  } else {
    const CONFIG_DATASOURCES = CONFIG_PROVIDER?.sources;
    const DATASOURCES = await createAcaLambdaModulesDatasources(CONFIG_DATASOURCES);
    addManyToRegistryByName(DATASOURCES);
  }
}

const initByConfigurationProvider = async (provider, path = DEFAULT_CONFIG_PATH) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
  setConfigurationProvider(provider);
  await initManyByRootConfiguration(path);
}

const initManyByTenant = async (
  params: {
    tenant?: {
      _datasources: any,
    }
  }) => {
  try {
    const TENANT = params?.tenant;
    const CONFIG_DATASOURCES_ALL = TENANT?._datasources;
    const CONFIG_DATASOURCES_CONVERSATIONS = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'lambdaModules' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_CONVERSATIONS)
    ) {
      const DATASOURCES = await createAcaLambdaModulesDatasources(CONFIG_DATASOURCES_CONVERSATIONS);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initManyByTenant', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getLambdaModulesDatasourceByContext = (
  context: {
    user?: {
      session?: {
        tenant?: any,
      }
    }
  }
) => {
  const TENANT = context?.user?.session?.tenant;
  if (
    lodash.isEmpty(TENANT)
  ) {
    const MESSAGE = `Missing context.user.session.tenant required parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const RET_VAL = getLambdaModulesDatasourceByTenant(TENANT);
  return RET_VAL;
}

const getLambdaModulesDatasourceByTenant = (
  tenant: {
    _datasources?: any,
  }
) => {
  const DATASOURCES_CONFIG = tenant?._datasources;
  let retVal: IDatasourceLambdaModulesV1;
  if (
    lodash.isArray(DATASOURCES_CONFIG)
  ) {
    const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'lambdaModules' })
    if (
      DATASOURCE_INDEX >= 0
    ) {
      const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
      const DATASOURCE_ID: string = DATASOURCE_CONFIGURATION?.id;
      const DATASOURCE_HASH = DATASOURCE_CONFIGURATION?.hash;
      retVal = getLambdaModulesDatasource(DATASOURCE_ID, DATASOURCE_HASH);
    }
  }
  return retVal;
}

const getLambdaModulesDatasource = (id = 'default', hash = undefined): IDatasourceLambdaModulesV1 => {
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

const getLambdaModulesDatasources = (context) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

export {
  initByConfigurationProvider,
  initManyByTenant,
  getLambdaModulesDatasourceByContext,
  getLambdaModulesDatasourceByTenant,
  getLambdaModulesDatasource,
  getLambdaModulesDatasources,
}
