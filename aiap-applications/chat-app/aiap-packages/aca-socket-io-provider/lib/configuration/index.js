/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-socket-io-provider-configuration';

const ramda = require('ramda');
const lodash = require('lodash');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (ramda.isNil(provider)) {
        throw new Error(`[${MODULE_ID}] - configuration provider is missing!`);
    }
    _provider = provider;
}

const setConfiguration = (configuration) => {
    _configuration = configuration;
};

const getConfiguration = () => {
    if(_provider){
        _configuration = _provider.getConfiguration();
    }
    return _configuration
}

const { SOCKET_IO_PROVIDER_SCHEMA } = require('./schema');

const { transformRawConfiguration } = require('./transformer');

class Configurator {
    static NAME = 'socketIOProvider';

    static async transformRawConfiguration(rawConfiguration, provider) {
        const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
        return RET_VAL;
    }

    static attachToJoiSchema(schema) {
        return schema.append(Configurator.schema());
    }

    static schema() {
        const RET_VAL = {
            [Configurator.NAME]: SOCKET_IO_PROVIDER_SCHEMA
        };
        return RET_VAL;
    }

    static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
        if (lodash.isEmpty(RET_VAL)) {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR',
                message: `[${MODULE_ID}] Missing required transformer schema!`
            };
            throw ACA_ERROR;
        }

        RET_VAL[Configurator.NAME] = await Configurator.transformRawConfiguration(rawConfiguration, provider);
    }
}

module.exports = {
    setConfigurationProvider, 
    setConfiguration,
    getConfiguration,
    Configurator,
}
