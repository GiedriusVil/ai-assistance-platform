/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-suggestions-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { setConfigurationProvider } = require('./lib/configurations');

const initByConfigurationProvider = async (provider) => {
   if (
      lodash.isEmpty(provider)
   ) {
      const ACA_ERROR = {
         type: 'INITIALIZATION_ERROR',
         message: `[${MODULE_ID}] Missing required provider parameter!`
      };
      throw ACA_ERROR;
   }
   setConfigurationProvider(provider);
}

const {
    suggestionsService
} = require('./lib/api');

module.exports = {
   initByConfigurationProvider,
   suggestionsService
}
