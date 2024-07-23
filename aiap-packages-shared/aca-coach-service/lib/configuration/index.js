/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-coach-service-lib-configuration';

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (lodash.isEmpty(provider)) {
        const ACA_ERROR = {
            type: 'INITIALIZATION_ERROR',
            message: `[${MODULE_ID}] Missing required provider parameter! [aca-common-config || aca-lite-config]`,
        };
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
    if (ramda.isNil(CONFIG)) {
        const ACA_ERROR = {
            type: 'INITIALIZATION_ERROR',
            message: `[${MODULE_ID}] Missing configuration!`
        };
        throw ACA_ERROR;
    }
}


module.exports = {
    ensureConfigurationExists,
    setConfigurationProvider,
    setConfiguration,
    getConfiguration,
}
