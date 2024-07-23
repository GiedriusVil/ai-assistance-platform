/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-service';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');

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
   jobsQueuesService,
} = require('./lib/api');

module.exports = {
   initByConfigurationProvider,
   jobsQueuesService,
}
