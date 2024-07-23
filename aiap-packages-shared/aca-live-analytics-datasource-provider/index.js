/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, formatIntoAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  setConfigurationProvider,
  getConfiguration,
  Configurator
} = require('./lib/configuration');

const { createAcaLiveAnalyticsDatasources } = require('./lib/datasource-factory');
const { 
  addManyToRegistryByName,
  addManyToRegistryByIdAndHash,
  getOneById,
  getOneByIdAndHash,
  getRegistry
} = require('@ibm-aca/aca-runtime-source-registry');

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
      const DATASOURCES = await createAcaLiveAnalyticsDatasources(CONFIG_DATASOURCES);
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
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
  await initManyByRootConfiguration(path);
}

const initManyByTenant = async (params) => {
  try {
    const TENANT = params?.tenant;
    const CONFIG_DATASOURCES_ALL = TENANT?._datasources;
    const CONFIG_DATASOURCES_LIVE_ANALYTICS = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'liveAnalytics' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_LIVE_ANALYTICS)
    ) {
      const DATASOURCES = await createAcaLiveAnalyticsDatasources(CONFIG_DATASOURCES_LIVE_ANALYTICS);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaLiveAnalyticsDatasourceByContext = (context) => {
  try {
    const TENANT = context?.user?.session?.tenant;
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing context.user.session.tenant required parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = getAcaLiveAnalyticsDatasourceByTenant(TENANT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAcaLiveAnalyticsDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaLiveAnalyticsDatasourceByTenant = (tenant) => {
  try {
    const DATASOURCES_CONFIG = tenant?._datasources;
    let retVal;
    if (
      lodash.isArray(DATASOURCES_CONFIG)
    ) {
      const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'liveAnalytics' });
      if (
        DATASOURCE_INDEX >= 0
      ) {
        const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
        const DATASOURCE_ID = DATASOURCE_CONFIGURATION?.id;
        const DATASOURCE_HASH = DATASOURCE_CONFIGURATION?.hash;
        retVal = getAcaLiveAnalyticsDatasource(DATASOURCE_ID, DATASOURCE_HASH);
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAcaLiveAnalyticsDatasourceByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaLiveAnalyticsDatasource = (id = 'default', hash = undefined) => {
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
    logger.error(getAcaLiveAnalyticsDatasource.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaLiveAnalyticsDatasources = (context) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}


module.exports = {
  initByConfigurationProvider,
  initManyByTenant,
  getAcaLiveAnalyticsDatasourceByContext,
  getAcaLiveAnalyticsDatasourceByTenant,
  getAcaLiveAnalyticsDatasources,
  getAcaLiveAnalyticsDatasource,
}
