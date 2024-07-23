/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { authByJWTBearerStrategy } = require('@ibm-aiap/aiap-passport-provider');

const { setConfigurationProvider } = require('./lib/configuration');

const {
  rulesRoutes,
  rulesImportRoutes,
  rulesMessagesRoutes,
  rulesMessagesImportRoutes
} = require('./lib/routes');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = `Missing required configuration provider parameter! [aca-common-config | aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = `Missing required app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
    app.use('/api/rules', authByJWTBearerStrategy({ session: false }), rulesRoutes);
    app.use('/api/rules-messages', authByJWTBearerStrategy({ session: false }), rulesMessagesRoutes);
    app.use('/api/import/rules', authByJWTBearerStrategy({ session: false }), rulesImportRoutes);
    app.use('/api/import/rules-messages', authByJWTBearerStrategy({ session: false }), rulesMessagesImportRoutes);
    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('initByConfigurationProvider', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
}
