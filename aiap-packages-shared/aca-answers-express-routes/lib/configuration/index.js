/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (ramda.isNil(provider)) {
        throw new Error('[ACA] aca-mongo-client - configuration provider is missing! [aca-common-config || aca-lite-config]');
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
