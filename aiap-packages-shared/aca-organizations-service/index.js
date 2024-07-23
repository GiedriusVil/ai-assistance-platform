/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
const MODULE_ID = 'aca-organizations-service-index';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { setConfigurationProvider } = require('./lib/configuration');

const {
  organizationsService,
  organizationsImportService,
  runtimeDataService,
} = require('./lib');

const initByConfigurationProvider = async (provider) => {
  if (
    !lodash.isEmpty(provider)
   ) {
    setConfigurationProvider(provider);
  } else {
    const ACA_ERROR = {
      type: 'SYSTEM_ERROR',
      messsage: `[${MODULE_ID}] Missing required provider parameter!`
    };
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
  organizationsService,
  organizationsImportService,
  runtimeDataService
}
