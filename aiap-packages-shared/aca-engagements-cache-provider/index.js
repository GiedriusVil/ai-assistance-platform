/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-engagements-cache-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const { setConfigurationProvider } = require('./lib/configuration');

const { AcaEngagementsCacheProvider } = require('./lib/provider');

let provider;

const initByConfigurationProvider = async (configurationProvider) => {
  if (
    lodash.isEmpty(configurationProvider)
  ) {
    const MESSAGE = 'Missing configuration provider!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
  }
  setConfigurationProvider(configurationProvider);
  provider = new AcaEngagementsCacheProvider();
}


const getAcaEngagementsCacheProvider = () => {
  if (
    lodash.isEmpty(provider)
  ) {
    const MESSAGE = `Please initialise cache provider!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
  return provider;
}

module.exports = {
  initByConfigurationProvider,
  getAcaEngagementsCacheProvider,
} 
