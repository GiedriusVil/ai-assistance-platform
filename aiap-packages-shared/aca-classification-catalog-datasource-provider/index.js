/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  setConfigurationProvider,
  getConfiguration,
  Configurator
} = require('./lib/configuration');

const { createAcaClassificationCatalogDatasources } = require('./lib/datasource-factory');
const { addManyToRegistryByName, addManyToRegistryByIdAndHash, getOneById, getOneByIdAndHash, getRegistry } = require('@ibm-aca/aca-runtime-source-registry');

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (path = DEFAULT_CONFIG_PATH) => {
  try {
    const CONFIG_ROOT = getConfiguration();
    const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
    if (
      lodash.isEmpty(CONFIG_PROVIDER)
    ) {
      logger.warn(`Disabled by configuration!`);
    } else {
      const CONFIG_DATASOURCES = ramda.path(['sources'], CONFIG_PROVIDER);
      const DATASOURCES = await createAcaClassificationCatalogDatasources(CONFIG_DATASOURCES);
      addManyToRegistryByName(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initManyByRootConfiguration', { ACA_ERROR });
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
    logger.error('initByConfigurationProvider', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const initManyByTenant = async (params) => {
  try {
    const TENANT = ramda.path(['tenant'], params);
    const CONFIG_DATASOURCES_ALL = ramda.path(['_datasources'], TENANT);
    const CONFIG_DATASOURCES_CONVERSATIONS = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'classificationCatalogs' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_CONVERSATIONS)
    ) {
      const DATASOURCES = await createAcaClassificationCatalogDatasources(CONFIG_DATASOURCES_CONVERSATIONS);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initManyByTenant', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaClassificationCatalogDatasourceByContext = (context) => {
  try {
    const TENANT = ramda.path(['user', 'session', 'tenant'], context);
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = `Missing context.user.session.tenant required parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = getAcaClassificationCatalogDatasourceByTenant(TENANT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('getAcaClassificationCatalogDatasourceByContext', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaClassificationCatalogDatasourceByTenant = (tenant) => {
  try {
    const DATASOURCES_CONFIG = ramda.path(['_datasources'], tenant);
    let retVal;
    if (
      lodash.isArray(DATASOURCES_CONFIG)
    ) {
      const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'classificationCatalogs' })
      if (
        DATASOURCE_INDEX >= 0
      ) {
        const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
        const DATASOURCE_ID = ramda.path(['id'], DATASOURCE_CONFIGURATION);
        const DATASOURCE_HASH = ramda.path(['hash'], DATASOURCE_CONFIGURATION);
        retVal = getAcaClassificationCatalogDatasource(DATASOURCE_ID, DATASOURCE_HASH);
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('getAcaClassificationCatalogDatasourceByTenant', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaClassificationCatalogDatasource = (id = 'default', hash = undefined) => {
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
    logger.error('getAcaClassificationCatalogDatasource', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaClassificationCatalogDatasources = (context) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

module.exports = {
  initByConfigurationProvider,
  initManyByTenant,
  getAcaClassificationCatalogDatasources,
  getAcaClassificationCatalogDatasource,
  getAcaClassificationCatalogDatasourceByContext,
  getAcaClassificationCatalogDatasourceByTenant,
}
