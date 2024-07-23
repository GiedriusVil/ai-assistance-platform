/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-datasource-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  setConfigurationProvider,
  getConfiguration,
  Configurator
} = require('./lib/configuration');

const { createAcaBuyRulesDatasources } = require('./lib/datasource-factory');
const { addManyToRegistryByName, addManyToRegistryByIdAndHash, getOneById, getOneByIdAndHash, getRegistry } = require('./lib/datasource-registry');

const DEFAULT_CONFIG_PATH = [Configurator.NAME];

const initManyByRootConfiguration = async (path = DEFAULT_CONFIG_PATH) => {
  const CONFIG_ROOT = getConfiguration();
  const CONFIG_PROVIDER = ramda.path(path, CONFIG_ROOT);
  if (
    lodash.isEmpty(CONFIG_PROVIDER)
  ) {
    logger.warn(`[${MODULE_ID}] Disabled by configuration!`);
  } else {
    const CONFIG_DATASOURCES = ramda.path(['sources'], CONFIG_PROVIDER);
    const DATASOURCES = await createAcaBuyRulesDatasources(CONFIG_DATASOURCES);
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
  const TENANT = ramda.path(['tenant'], params);
  try {
    const CONFIG_DATASOURCES_ALL = ramda.path(['_datasources'], TENANT);
    const CONFIG_DATASOURCES_CONVERSATIONS = lodash.filter(CONFIG_DATASOURCES_ALL, { type: 'buyRules' });
    if (
      !lodash.isEmpty(CONFIG_DATASOURCES_CONVERSATIONS)
    ) {

      const DATASOURCES = await createAcaBuyRulesDatasources(CONFIG_DATASOURCES_CONVERSATIONS);
      await addManyToRegistryByIdAndHash(DATASOURCES);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initManyByTenant.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getAcaBuyRulesDatasourceByContext = (context) => {
  const TENANT = ramda.path(['user', 'session', 'tenant'], context);
  if (
    lodash.isEmpty(TENANT)
  ) {
    const MESSAGE = `Missing context.user.session.tenant required parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }
  const RET_VAL = getAcaBuyRulesDatasourceByTenant(TENANT);
  return RET_VAL;
}

const getAcaBuyRulesDatasourceByTenant = (tenant) => {
  const DATASOURCES_CONFIG = ramda.path(['_datasources'], tenant);
  let retVal;
  if (
    lodash.isArray(DATASOURCES_CONFIG)
  ) {
    const DATASOURCE_INDEX = lodash.findIndex(DATASOURCES_CONFIG, { type: 'buyRules' })
    if (
      DATASOURCE_INDEX >= 0
    ) {
      const DATASOURCE_CONFIGURATION = DATASOURCES_CONFIG[DATASOURCE_INDEX];
      const DATASOURCE_ID = ramda.path(['id'], DATASOURCE_CONFIGURATION);
      const DATASOURCE_HASH = ramda.path(['hash'], DATASOURCE_CONFIGURATION);
      retVal = getAcaBuyRulesDatasource(DATASOURCE_ID, DATASOURCE_HASH);
    }
  }
  return retVal;
}

const getAcaBuyRulesDatasource = (id = 'default', hash = undefined) => {
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

const getAcaBuyRulesDatasources = (context) => {
  const RET_VAL = getRegistry();
  return RET_VAL;
}


module.exports = {
  initByConfigurationProvider,
  initManyByTenant,
  getAcaBuyRulesDatasourceByContext,
  getAcaBuyRulesDatasourceByTenant,
  getAcaBuyRulesDatasources,
  getAcaBuyRulesDatasource,
}
