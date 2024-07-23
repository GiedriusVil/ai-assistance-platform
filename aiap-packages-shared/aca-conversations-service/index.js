/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');
const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (provider) => {
  if (!ramda.isNil(provider)) {
     setConfigurationProvider(provider);
     logger.info('INITIALIZED');
  } else {
     throw new Error('[ACA] Ensure that either configuration provider is passed!');
  }
}

const {
   conversationsService,
   transcriptsService,
   utterancesService,
   surveysService,
   feedbacksService,
} = require('./lib/api/index');

module.exports = {
   initByConfigurationProvider,
   conversationsService,
   transcriptsService,
   utterancesService,
   surveysService,
   feedbacksService,
}
