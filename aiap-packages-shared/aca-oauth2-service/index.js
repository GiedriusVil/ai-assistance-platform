/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
const MODULE_ID = 'aca-oauth2-service-index';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { setConfigurationProvider } = require('./lib/configuration');

const {
  oauth2Service,
  oauth2TokenAccessService,
  oauth2TokensRefreshService,
} = require('./lib');

const initByConfigurationProvider = async (provider) => {
  if (
    !lodash.isEmpty(provider)
  ) {
    setConfigurationProvider(provider);
  } else {
    const ERROR_MESSAGE = `Missing required provider parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }
}

module.exports = {
  initByConfigurationProvider,
  oauth2Service,
  oauth2TokenAccessService,
  oauth2TokensRefreshService,
}
