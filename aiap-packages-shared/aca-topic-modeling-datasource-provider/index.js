/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  setConfigurationProvider,
  getConfiguration,
  Configurator
} = require('./lib/configuration');

const { createAcaTopicModelingDatasources } = require('./lib/datasource-factory');
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
    const DATASOURCES = await createAcaTopicModelingDatasources(CONFIG_DATASOURCES);
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

const initManyByTenant = async (params) => {
  const TENANT = params?.tenant;
  const CONFIG_DATASOURCES_ALL = TENANT?._datasources;
  try {
    const CONFIG_DATASOURCES_TOPIC_MODELING = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'topicModeling' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_TOPIC_MODELING)
    ) {
      const DATASOURCES = await createAcaTopicModelingDatasources(CONFIG_DATASOURCES_TOPIC_MODELING);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initManyByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaTopicModelingDatasourceByContext = (context) => {
  const TENANT = context?.user?.session?.tenant;
  if (
    lodash.isEmpty(TENANT)
  ) {
    const MESSAGE = `Missing context.user.session.tenant required parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const RET_VAL = getAcaTopicModelingDatasourceByTenant(TENANT);
  return RET_VAL;
}

const getAcaTopicModelingDatasourceByTenant = (tenant) => {
  const DATASOURCES_CONFIG = tenant?._datasources;
  let retVal;
  if (
    lodash.isArray(DATASOURCES_CONFIG)
  ) {
    const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'topicModeling' });
    if (
      DATASOURCE_INDEX >= 0
    ) {
      const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
      const DATASOURCE_ID = DATASOURCE_CONFIGURATION?.id;
      const DATASOURCE_HASH = DATASOURCE_CONFIGURATION?.hash;
      retVal = getAcaTopicModelingDatasource(DATASOURCE_ID, DATASOURCE_HASH);
    }
  }
  return retVal;
}

const getAcaTopicModelingDatasource = (id = 'default', hash = undefined) => {
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

const getAcaTopicModelingDatasources = (context) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}

module.exports = {
  initByConfigurationProvider,
  initManyByTenant,
  getAcaTopicModelingDatasources,
  getAcaTopicModelingDatasource,
  getAcaTopicModelingDatasourceByContext,
  getAcaTopicModelingDatasourceByTenant,
}
