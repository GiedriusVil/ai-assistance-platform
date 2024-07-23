/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-suggestions-express-routes-configuration';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError} = require('@ibm-aca/aca-utils-errors');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (ramda.isNil(provider)) {
      const MESSAGE = '[ACA] aca-mongo-client - configuration provider is missing! [aca-common-config || aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
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
    if (ramda.isNil(CONFIG)) {
      const MESSAGE = '[ACA] Configuration is missing!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
}


module.exports = {
    ensureConfigurationExists,
    setConfigurationProvider, 
    setConfiguration,
    getConfiguration,
}
