/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-watson-discovery-v2-client-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { setConfigurationProvider, getConfiguration, Configurator } = require('./lib/configuration');
const { WDV2Service } = require('./lib');

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
   const WD_PROVIDER_CONFIGS = ramda.path([PATH], ROOT_CONFIGS);

   if (lodash.isEmpty(WD_PROVIDER_CONFIGS)) {
      const MESSAGE = `Missing ${PATH} configuration!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
   }

   const WD_SERVICES_CONFIG = ramda.path(['services'], WD_PROVIDER_CONFIGS);
   if (ramda.isNil(WD_SERVICES_CONFIG)) {
      const MESSAGE = `${PATH} missing clients configuration!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
   }

   const PROMISES = [];
   for (let tmpConfig of WD_SERVICES_CONFIG) {
      if (!ramda.isNil(tmpConfig)) {
         const SERVICE_CONFIG = {
            maxRetries: WD_PROVIDER_CONFIGS.maxRetries,
            backoffDelay: WD_PROVIDER_CONFIGS.backoffDelay,
            unavailableMessage: WD_PROVIDER_CONFIGS.unavailableMessage,
            resultsLimit: WD_PROVIDER_CONFIGS.resultsLimit,
            poller: WD_PROVIDER_CONFIGS.poller,
            service: [
               tmpConfig
            ],
         };
         PROMISES.push(createWDClient(SERVICE_CONFIG));
      }
   }
   await Promise.all(PROMISES);
}


const createWDClient = async (config) => {
   const WD_CLIENT_NAME = ramda.path(['service', '0', 'name'], config);
   const WD_CLIENT = new WDV2Service(config);
   await WD_CLIENT.init();
   const WD_CLIENT_OLD = getWDClient(WD_CLIENT_NAME);

   if (ramda.isNil(WD_CLIENT_OLD)) {
      clients[WD_CLIENT_NAME] = WD_CLIENT;
      logger.info(`INITIALIZED WD client: ${WD_CLIENT_NAME}`);
   } else {
      clients[WD_CLIENT_NAME] = WD_CLIENT_OLD;
      logger.info(`REPLACED WD client: ${WD_CLIENT_NAME}`);
   }

   const RET_VAL = getWDClient(WD_CLIENT_NAME);
   return RET_VAL;
}

const getWDClient = (name = 'default') => {
   const RET_VAL = clients[name];
   return RET_VAL;
}

module.exports = {
   initByConfigurationProvider,
   getWDClient,
};
