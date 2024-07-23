/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { Configurator, setConfigurationProvider, getConfiguration, } = require('./lib/configuration');

const { createAcaOauth2Datasources } = require('./lib/datasource-factory');
const { addManyToRegistryByName, addManyToRegistryByIdAndHash, getOneById, getOneByIdAndHash, getRegistry } = require('@ibm-aca/aca-runtime-source-registry');

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
    const DATASOURCES = await createAcaOauth2Datasources(CONFIG_DATASOURCES);
    addManyToRegistryByName(DATASOURCES);
  }
}

const initByConfigurationProvider = async (provider, path = DEFAULT_CONFIG_PATH) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ERROR_MESSAGE = `Please provide configuration provider! [aca-common-config, aca-lite-config]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }
  setConfigurationProvider(provider);
  await initManyByRootConfiguration(path);
}

const initManyByTenant = async (params) => {
  const TENANT = params?.tenant;
  try {
    const CONFIG_DATASOURCES_ALL = TENANT?._datasources;
    const CONFIG_DATASOURCES_ORGANIZATIONS = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'oauth2' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_ORGANIZATIONS)
    ) {
      const DATASOURCES = await createAcaOauth2Datasources(CONFIG_DATASOURCES_ORGANIZATIONS);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaOauth2DatasourceByContext = (context) => {
  const TENANT = context?.user?.session?.tenant;
  if (
    lodash.isEmpty(TENANT)
  ) {
    const ERROR_MESSAGE = `Missing context.user.session.tenant required parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
  }
  const RET_VAL = getAcaOauth2DatasourceByTenant(TENANT);
  return RET_VAL;
}

const getAcaOauth2DatasourceByTenant = (tenant) => {
  const DATASOURCES_CONFIG = tenant?._datasources;
  let retVal;
  if (
    lodash.isArray(DATASOURCES_CONFIG)
  ) {
    const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'oauth2' });
    if (
      DATASOURCE_INDEX >= 0
    ) {
      const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
      const DATASOURCE_ID = DATASOURCE_CONFIGURATION?.id;
      const DATASOURCE_HASH = DATASOURCE_CONFIGURATION?.hash;
      retVal = getAcaOauth2Datasource(DATASOURCE_ID, DATASOURCE_HASH);
    }
  }
  return retVal;
}

const getAcaOauth2Datasource = (id = 'default', hash = undefined) => {
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


const getAcaOauth2Datasources = (context) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

module.exports = {
  initByConfigurationProvider,
  initManyByTenant,
  getAcaOauth2Datasources,
  getAcaOauth2DatasourceByContext,
  getAcaOauth2DatasourceByTenant,
  getAcaOauth2Datasource,
}
