/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-demo-express-routes-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const routes = require('./lib/routes');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (cProvider, app) => {
    try {
        setConfigurationProvider(cProvider);
        if (
            lodash.isEmpty(app)
        ) {
            const MESSAGE = 'Missing required app parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
        }
        setConfigurationProvider(cProvider);
        app.use('/demo', routes);
        logger.info('INITIALIZED');
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    initByConfigurationProvider,
}
