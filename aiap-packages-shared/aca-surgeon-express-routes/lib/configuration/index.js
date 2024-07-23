/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
const MODULE_ID = 'aca-surgeon-express-routes-configurator';

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

let _provider;
let _configuration;

const { ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const setConfigurationProvider = (provider) => {
    if (
        lodash.isEmpty(provider)
    ) {
        const MESSAGE = 'Missing required configuration provider! [aca-common-config || aca-lite-config]';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
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
        const MESSAGE = 'Missing configuration!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
}


module.exports = {
    ensureConfigurationExists,
    setConfigurationProvider,
    setConfiguration,
    getConfiguration,
}
