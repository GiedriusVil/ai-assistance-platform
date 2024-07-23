/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
const MODULE_ID = 'aca-topic-modeling-express-routes-configuration';

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (
        lodash.isEmpty(provider)
    ) {
        const ACA_ERROR = {
            type: 'VALIDATION_ERROR',
            message: `[${MODULE_ID}] Configuration provider is missing! Provider [aca-common-config || aca-lite-config] configuration providers!`,
        }
        throw ACA_ERROR;
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
        const ACA_ERROR = {
            type: 'VALIDATION_ERROR',
            message: `[${MODULE_ID}] Configuration is missing!`,
        }
        throw ACA_ERROR;
    }
}


module.exports = {
    ensureConfigurationExists,
    setConfigurationProvider,
    setConfiguration,
    getConfiguration,
}
