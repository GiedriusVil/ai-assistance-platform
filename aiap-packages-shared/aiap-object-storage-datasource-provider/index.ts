/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-object-storage-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  addManyToRegistryByName,
  addManyToRegistryByIdAndHash,
  getOneById,
  getOneByIdAndHash,
  getRegistry
} from '@ibm-aca/aca-runtime-source-registry';

import {
  setConfigurationProvider,
  getConfiguration,
  Configurator,
} from './lib/configuration';

import {
  IDatasourceObjectStorageV1,
} from './lib/types';

import {
  createDatasources,
} from './lib/datasource-factory';

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (path = DEFAULT_CONFIG_PATH) => {
  try {
    const CONFIG_ROOT = getConfiguration();
    const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
    if (
      lodash.isEmpty(CONFIG_PROVIDER)
    ) {
      logger.warn(`[${MODULE_ID}] Disabled by configuration!`);
    } else {
      const CONFIG_DATASOURCES = CONFIG_PROVIDER?.sources;
      const DATASOURCES = await createDatasources(CONFIG_DATASOURCES);
      addManyToRegistryByName(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByRootConfiguration.name,
      {
        ACA_ERROR,
      });

    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (provider, path = DEFAULT_CONFIG_PATH) => {
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

const initManyByTenant = async (
  params: {
    tenant?: {
      _datasources: any,
    }
  }
) => {
  try {
    const TENANT = params?.tenant;
    const CONFIG_DATASOURCES_ALL = TENANT?._datasources;
    const CONFIG_DATASOURCES_CONVERSATIONS = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'objectStorage' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_CONVERSATIONS)
    ) {
      const DATASOURCES = await createDatasources(CONFIG_DATASOURCES_CONVERSATIONS);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getObjectStorageDatasourceByContext = (
  context: {
    user?: {
      session?: {
        tenant?: any,
      }
    }
  }
): IDatasourceObjectStorageV1 => {
  try {
    if (
      lodash.isEmpty(context?.user?.session?.tenant)
    ) {
      const MESSAGE = `Missing context?.user?.session?.tenant required parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const TENANT = context?.user?.session?.tenant;
    const RET_VAL = getObjectStorageDatasourceByTenant(TENANT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getObjectStorageDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getObjectStorageDatasourceByTenant = (
  tenant: {
    _datasources?: any,
  }
): IDatasourceObjectStorageV1 => {
  try {
    const DATASOURCES_CONFIG = tenant?._datasources;
    let retVal;
    if (
      lodash.isArray(DATASOURCES_CONFIG)
    ) {
      const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'objectStorage' })
      if (
        DATASOURCE_INDEX >= 0
      ) {
        const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
        const DATASOURCE_ID = DATASOURCE_CONFIGURATION?.id;
        const DATASOURCE_HASH = DATASOURCE_CONFIGURATION?.hash;

        retVal = getObjectStorageDatasource(DATASOURCE_ID, DATASOURCE_HASH);
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getObjectStorageDatasourceByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getObjectStorageDatasource = (
  id = 'default',
  hash = undefined
): IDatasourceObjectStorageV1 => {
  try {
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
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getObjectStorageDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getObjectStorageDatasources = (
  context: any
) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

export * from './lib/types';

export {
  initByConfigurationProvider,
  initManyByTenant,
  getObjectStorageDatasourceByTenant,
  getObjectStorageDatasourceByContext,
  getObjectStorageDatasource,
  getObjectStorageDatasources,
}
