/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('ramda');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (ramda.isNil(provider)) {
        const ACA_ERROR = {
            type: 'INITIALIZATION_ERROR', 
            message: `Missing require configuration provider! [aca-common-config || aca-lite-config]`
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
        throw new Error('[ACA] Configuration is missing!');
    }
}

module.exports = {
    ensureConfigurationExists,
    setConfigurationProvider, 
    setConfiguration,
    getConfiguration,
}
