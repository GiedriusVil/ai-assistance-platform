/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ibm-box-connector-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const routes = require('./lib/routes');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (configurationProvider, app) => {
    try {
        setConfigurationProvider(configurationProvider);
        if (
            lodash.isEmpty(app)
        ) {
            const MESSAGE = 'Missing required app parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
        }
        setConfigurationProvider(configurationProvider);
        app.use('/box', routes);
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
