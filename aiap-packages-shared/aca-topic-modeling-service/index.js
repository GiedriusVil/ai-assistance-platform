/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-service';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (provider) => {
  if (!ramda.isNil(provider)) {
     setConfigurationProvider(provider);
     LOGGER.info('INITIALIZED');
  } else {
     const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required provider parameter!`
     };
     throw ACA_ERROR;
  }
}

const {
   topicModelingService,
} = require('./lib/api');

module.exports = {
   initByConfigurationProvider,
   topicModelingService,
}
