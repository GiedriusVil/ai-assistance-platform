/*
	© Copyright IBM Corporation 2024. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-middleware-common-log-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { setConfigurationProvider } from './lib/configuration';

const initByConfigurationProvider = async (provider) => {
    try {
        if (
            lodash.isEmpty(provider)
        ) {
            const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
        }
        setConfigurationProvider(provider);
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const { CommonLogWare } = require('./lib');

export {
    initByConfigurationProvider,
    CommonLogWare,
};
