/*
	© Copyright IBM Corporation 2024. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-button-skip';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

let _provider;
let _configuration;

const setConfigurationProvider = (provider) => {
    if (
        lodash.isEmpty(provider)
    ) {
        const MESSAGE = `Missing required provider parameter! [aca-common-config || aca-lite-config]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    _provider = provider;
}

const getConfiguration = () => {
    if (_provider) {
        _configuration = _provider.getConfiguration();
    }
    return _configuration;
}

const getLibConfiguration = () => {
    const RET_VAL = getConfiguration()?.NAME;
    return RET_VAL;
}

const ensureConfigurationExists = () => {
    const CONFIGURATION = getLibConfiguration();
    if (
        lodash.isEmpty(CONFIGURATION)
    ) {
        const MESSAGE = `Missing library configuration!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
}

import { SCHEMA } from './schema';
import { transformRawConfiguration } from './transformer';

class Configurator {

    static NAME = 'middlwareConversationTone';

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
            const MESSAGE = `Missing root configuration container!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
        }
        RET_VAL[Configurator.NAME] = await Configurator.transformRawConfiguration(rawConfiguration, provider);
    }
}


export {
    ensureConfigurationExists,
    setConfigurationProvider,
    getConfiguration,
    getLibConfiguration,
    Configurator,
}
