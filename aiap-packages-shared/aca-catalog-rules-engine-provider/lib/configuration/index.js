/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-engine-provider-configurator';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { SCHEMA } = require('./schema');
const { transformRawConfiguration } = require('./transformer');

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (
        lodash.isEmpty(provider)
    ) {
        const MESSAGE = `Missing required configuration provider parameter! [aca-common-config || aca-lite-config]`;
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

class Configurator {

    static NAME = 'acaCatalogRulesEngineProvider';

    static async transformRawConfiguration(rawConfiguration, provider) {
        const RET_VAL = await transformRawConfiguration(rawConfiguration, provider);
        return RET_VAL;
    }

    static attachToJoiSchema(schema) {
        return schema.append(Configurator.schema());
    }

    static schema() {
        const RET_VAL = {
            [Configurator.NAME]: SCHEMA,
        };
        return RET_VAL;
    }

    static async loadConfiguration(RET_VAL, rawConfiguration, provider) {
        if (
            lodash.isEmpty(RET_VAL)
        ) {
            const MESSAGE = `Missing required root configuration container!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
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
