/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const LOGGER_NAME = 'aca-cos-instance-provider';
const logger = require('@ibm-aca/aca-common-logger')(LOGGER_NAME);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getExpirationPrefix } = require('./lib/utils');
const { setConfigurationProvider, getConfiguration, Configurator } = require('./lib/configuration');
const { AcaCosInstance } = require('./lib/aca-cos-instance');

const DEFAULT_COS_INSTANCE_PROVIDER_CONFIGURATION_PATH = [Configurator.NAME];

const instances = {};

const createAcaCosInstance = async (config) => {
  const COS_INSTANCE_NAME = ramda.path(['name'], config);
  const COS_INSTANCE = new AcaCosInstance(config);
  await COS_INSTANCE.initialize();
  const COS_INSTANCE_OLD = getAcaCosInstance(COS_INSTANCE_NAME);
  if (lodash.isEmpty(COS_INSTANCE_OLD)) {
    instances[COS_INSTANCE_NAME] = COS_INSTANCE;
    logger.info(`INITIALIZED cos instance: ${COS_INSTANCE_NAME}`);
  } else {
    logger.info(`Instance named: ${COS_INSTANCE_NAME} is already initialized!`);
  }

  const RET_VAL = getAcaCosInstance(COS_INSTANCE_NAME);
  return RET_VAL;
}

const init = async ( path = DEFAULT_COS_INSTANCE_PROVIDER_CONFIGURATION_PATH ) => {
  const CONFIG_AT_ROOT_LVL = getConfiguration();
  const COS_INSTANCE_PROVIDER_CONFIG = ramda.path(path, CONFIG_AT_ROOT_LVL);

  if (lodash.isEmpty(COS_INSTANCE_PROVIDER_CONFIG)) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${LOGGER_NAME}][ACA] Missing ${path} configuration!`
    }
    throw ACA_ERROR;
  }

  const COS_INSTANCES_CONFIG = ramda.path(['instances'], COS_INSTANCE_PROVIDER_CONFIG);

  if (lodash.isEmpty(COS_INSTANCES_CONFIG)) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${LOGGER_NAME}] ${path} -> instances configuration!`
    }
    throw ACA_ERROR;
  }

  const PROMISES = [];

  for (let tmpConfig of COS_INSTANCES_CONFIG) {
    if (!lodash.isEmpty(tmpConfig)) {
      PROMISES.push(createAcaCosInstance(tmpConfig));
    }
  }

  await Promise.all(PROMISES);
}

const initByConfigurationProvider = async ( provider, path = DEFAULT_COS_INSTANCE_PROVIDER_CONFIGURATION_PATH ) => {
  if (lodash.isEmpty(provider)) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${LOGGER_NAME}] Ensure that either configuration provider is passed!`
    };
    throw ACA_ERROR;
  }

  setConfigurationProvider(provider);

  await init(path);
}

const getAcaCosInstance = (name = 'default') => {
  const RET_VAL = instances[name];
  return RET_VAL;
}

const getAcaCosInstances = () => {
  return instances;
}

const getKey = (userId = 'default', prefix) => {
  const EXPIRATION = getExpirationPrefix(); // TODO remove once Expires variable is fixed. For some reason event though an ISO date is required it does not work.
  const DATE = new Date().toISOString();
  const KEY = `${EXPIRATION}|${prefix}|${userId}|${DATE}`;
  return KEY;
}

module.exports = {
  initByConfigurationProvider,
  getAcaCosInstances,
  getAcaCosInstance,
  getKey,
};
