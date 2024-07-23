/*
    © Copyright IBM Corporation 2022. All Rights Reserved 
     
    SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-express-routes-configuration-index';

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
    ACA_ERROR_TYPE,
    throwAcaError,
} from '@ibm-aca/aca-utils-errors';

let _provider;
let _configuration;

const setConfigurationProvider = (
    provider: any
) => {
    if (
        ramda.isNil(provider)
    ) {
        const ERROR_MESSAGE = `Missing configuration provider! [aca-common-config || aca-lite-config]`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    _provider = provider;
}

const setConfiguration = (
    configuration: any
) => {
    _configuration = configuration;
};

const getConfiguration = () => {
    if (
        _provider
    ) {
        _configuration = _provider.getConfiguration();
    }
    return _configuration;
}

const ensureConfigurationExists = () => {
    const CONFIG = getConfiguration();
    if (
        ramda.isNil(CONFIG)
    ) {
        const ERROR_MESSAGE = `Missing configuration!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
}


export {
    ensureConfigurationExists,
    setConfigurationProvider,
    setConfiguration,
    getConfiguration,
}
