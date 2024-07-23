/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-middlware-fulfill-configuration';

const lodash = require('lodash');
const ramda = require('ramda');

const { FULFILL_SCHEMA } = require('./schema');
const { transformRawConfiguration } = require('./transformer');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (
        lodash.isEmpty(provider)
    ) {
        const ACA_ERROR = {
            type: `INITIALIZATION_ERROR`, 
            message: `[${MODULE_ID}] Missing required configuration provider parameter! [aca-common-config || aca-lite-config]`
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

    if (
        lodash.isEmpty(CONFIG)
    ) {
        const ACA_ERROR = {
            type: 'INITIALIZATION_ERROR',
            message: `[${MODULE_ID}] Missing configuration!`
        };
        throw ACA_ERROR;
    }
}

class Configurator {

    static NAME = 'acaFulfillConfigurator';

    static attachToJoiSchema(schema) {
        return schema.append(Configurator.schema());
    }

    static schema() {
        const RET_VAL = {
            [Configurator.NAME]: FULFILL_SCHEMA,
        };
        return RET_VAL;
    }

    static async transformRawConfiguration(rawConfiguration, provider) {
        const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
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
    ensureConfigurationExists,
    setConfigurationProvider, 
    setConfiguration,
    getConfiguration,
    Configurator,
}
