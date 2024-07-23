/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  addManyToRegistryByName,
  addManyToRegistryByIdAndHash,
  getOneById,
  getOneByIdAndHash,
  getRegistry,
} from '@ibm-aca/aca-runtime-source-registry';

import {
  IContextTenantV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  setConfigurationProvider,
  getConfiguration,
  Configurator,
} from './lib/configuration';

import {
  createEngagementsDatasources
} from './lib/datasource-factory';

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (
  path: Array<string> = DEFAULT_CONFIG_PATH
) => {
  try {
    const CONFIG_ROOT = getConfiguration();
    const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
    if (
      lodash.isEmpty(CONFIG_PROVIDER)
    ) {
      logger.warn(`[${MODULE_ID}] Disabled by configuration!`);
    } else {
      const CONFIG_DATASOURCES = CONFIG_PROVIDER?.sources;
      const DATASOURCES = await createEngagementsDatasources(CONFIG_DATASOURCES);
      addManyToRegistryByName(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByRootConfiguration.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initByConfigurationProvider = async (
  provider,
  path = DEFAULT_CONFIG_PATH
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
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
  await initManyByRootConfiguration(path);
}

const initManyByTenant = async (
  params: {
    tenant: IContextTenantV1
  }
) => {
  try {
    const TENANT = params?.tenant;
    const CONFIG_DATASOURCES_ALL = TENANT?._datasources;
    const CONFIG_DATASOURCES_CONVERSATIONS = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'engagements' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_CONVERSATIONS)
    ) {
      const DATASOURCES = await createEngagementsDatasources(CONFIG_DATASOURCES_CONVERSATIONS);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getEngagementsDatasourceByContext = (
  context: IContextV1
) => {
  try {
    const TENANT = context?.user?.session?.tenant;
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing context.user.session.tenant required parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = getEngagementsDatasourceByTenant(TENANT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getEngagementsDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getEngagementsDatasourceByTenant = (
  tenant: IContextTenantV1
) => {
  try {
    const DATASOURCES_CONFIG = tenant?._datasources;
    let retVal;
    if (
      lodash.isArray(DATASOURCES_CONFIG)
    ) {
      const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'engagements' })
      if (
        DATASOURCE_INDEX >= 0
      ) {
        const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
        const DATASOURCE_ID = DATASOURCE_CONFIGURATION?.id;
        const DATASOURCE_HASH = DATASOURCE_CONFIGURATION?.hash;
        retVal = getEngagementsDatasource(DATASOURCE_ID, DATASOURCE_HASH);
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getEngagementsDatasourceByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getEngagementsDatasource = (
  id = 'default',
  hash = undefined
) => {
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
    logger.error(getEngagementsDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getEngagementsDatasources = (
  context: IContextV1
) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}


export {
  initByConfigurationProvider,
  initManyByTenant,
  getEngagementsDatasourceByContext,
  getEngagementsDatasourceByTenant,
  getEngagementsDatasources,
  getEngagementsDatasource,
}
