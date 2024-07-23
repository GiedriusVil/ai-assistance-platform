/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-translator-client-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { setConfigurationProvider, getConfiguration, Configurator } = require('./lib/configuration');
const { WTV3Service } = require('./lib');

let clients = {};

const initByConfigurationProvider = async (provider) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
  setConfigurationProvider(provider);
  init();
}

const init = async () => {

  const PATH = Configurator.NAME
  const ROOT_CONFIGS = getConfiguration();
  const WT_PROVIDER_CONFIGS = ramda.path([PATH], ROOT_CONFIGS);

  if (lodash.isEmpty(WT_PROVIDER_CONFIGS)) {
    const MESSAGE = `Missing ${PATH} configuration! WT_PROVIDER_CONFIGS`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }

  const WT_SERVICES_CONFIG = WT_PROVIDER_CONFIGS?.services;
  if (ramda.isNil(WT_SERVICES_CONFIG)) {
    const MESSAGE = `${PATH} missing clients configuration!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }

  const PROMISES = [];
  for (let tmpConfig of WT_SERVICES_CONFIG) {
    if (!ramda.isNil(tmpConfig)) {
      const SERVICE_CONFIG = {
        service: [
          tmpConfig
        ],
      };
      PROMISES.push(createWTClient(SERVICE_CONFIG));
    }
  }
  await Promise.all(PROMISES);
}

const createWTClient = async (config) => {
  const WT_CLIENT_NAME = ramda.path(['service', '0', 'name'], config);
  const WT_CLIENT = new WTV3Service(config);
  await WT_CLIENT.init();
  const WT_CLIENT_OLD = getWTClient(WT_CLIENT_NAME);

  if (ramda.isNil(WT_CLIENT_OLD)) {
    clients[WT_CLIENT_NAME] = WT_CLIENT;
    logger.info(`INITIALIZED WT client: ${WT_CLIENT_NAME}`);
  } else {
    clients[WT_CLIENT_NAME] = WT_CLIENT_OLD;
    logger.info(`REPLACED WT client: ${WT_CLIENT_NAME}`);
  }

  const RET_VAL = getWTClient(WT_CLIENT_NAME);
  return RET_VAL;
}

const getWTClient = (name = 'default') => {
  const RET_VAL = clients[name];
  return RET_VAL;
}

module.exports = {
  initByConfigurationProvider,
  getWTClient,
};
