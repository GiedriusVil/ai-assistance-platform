/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-organizations-expres-routes-configuration`;

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ERROR_MESSAGE = `Missing required configuration provider!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
  }
  _provider = provider;
}

const setConfiguration = (configuration) => {
  _configuration = configuration;
};

const getConfiguration = () => {
  if (_provider) {
    _configuration = _provider.getConfiguration();
  }
  return _configuration;
}

const ensureConfigurationExists = () => {
  const CONFIG = getConfiguration();
  if (
    lodash.isEmpty(CONFIG)
  ) {
    const ERROR_MESSAGE = `Missing configurattion!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE)
  }
}


module.exports = {
  ensureConfigurationExists,
  setConfigurationProvider,
  setConfiguration,
  getConfiguration,
}
