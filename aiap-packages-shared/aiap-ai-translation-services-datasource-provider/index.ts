/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

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
  IDatasourceConfigurationV1
} from '@ibm-aiap/aiap--types-datasource';

import {
  IContextTenantV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IDatasourceTranslationServicesV1,
} from './lib/types';

import {
  setConfigurationProvider,
  getConfiguration,
  Configurator,
} from './lib/configuration';

import {
  createAiTranslationServicesDatasources
} from './lib/datasource-factory';


const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (path = DEFAULT_CONFIG_PATH) => {
  try {

    const CONFIG_ROOT = getConfiguration();
    const CONFIG_PROVIDER = CONFIG_ROOT?.path;
    if (
      lodash.isEmpty(CONFIG_PROVIDER)
    ) {
      logger.warn(`[${MODULE_ID}] Disabled by configuration!`);
    } else {
      const CONFIG_DATASOURCES = CONFIG_PROVIDER?.sources;
      const DATASOURCES = await createAiTranslationServicesDatasources(CONFIG_DATASOURCES);
      addManyToRegistryByName(DATASOURCES);
    }
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
    logger.error(initByConfigurationProvider.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}

const initManyByTenant = async (
  params: {
    tenant?: {
      _datasources: Array<IDatasourceConfigurationV1>,
    }
  }
) => {
  try {
    const TENANT = params?.tenant;
    const CONFIG_DATASOURCES_ALL = TENANT?._datasources;
    const CONFIG_DATASOURCES_AI_TRANSLATION_SERVICES = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'aiTranslationServices' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_AI_TRANSLATION_SERVICES)
    ) {
      const DATASOURCES = await createAiTranslationServicesDatasources(CONFIG_DATASOURCES_AI_TRANSLATION_SERVICES);
      addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAiTranslationServicesDatasourceByContext = (
  context: {
    user?: {
      session?: {
        tenant?: IContextTenantV1,
      }
    }
  }
): IDatasourceTranslationServicesV1 => {
  try {
    const TENANT = context?.user?.session?.tenant;
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing context.user.session.tenant required parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = getAiTranslationServicesDatasourceByTenant(TENANT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAiTranslationServicesDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAiTranslationServicesDatasourceByTenant = (
  tenant: {
    _datasources?: Array<IDatasourceConfigurationV1>,
  }
): IDatasourceTranslationServicesV1  => {
  try {
    const DATASOURCES_CONFIG = tenant?._datasources;
    let retVal;
    if (
      lodash.isArray(DATASOURCES_CONFIG)
    ) {
      const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'aiTranslationServices' })
      if (
        DATASOURCE_INDEX >= 0
      ) {
        const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
        const DATASOURCE_ID = DATASOURCE_CONFIGURATION?.id;
        const DATASOURCE_HASH = DATASOURCE_CONFIGURATION?.hash;
        retVal = getAiTranslationServicesDatasource(DATASOURCE_ID, DATASOURCE_HASH);
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAiTranslationServicesDatasourceByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAiTranslationServicesDatasource = (
  id = 'default', 
  hash = undefined
): IDatasourceTranslationServicesV1 => {
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
    logger.error(getAiTranslationServicesDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAiTranslationServicesDatasources = (
  context: IContextV1
) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

export {
  initByConfigurationProvider,
  initManyByTenant,
  getAiTranslationServicesDatasourceByContext,
  getAiTranslationServicesDatasourceByTenant,
  getAiTranslationServicesDatasource,
  getAiTranslationServicesDatasources,
}
