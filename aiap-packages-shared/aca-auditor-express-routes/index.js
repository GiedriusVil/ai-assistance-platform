/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { authByJWTBearerStrategy } = require('@ibm-aiap/aiap-passport-provider');

const {
  purchaseRequestsRoutes,
  rulesRoutes,
  rulesMessagesRoutes,
  organizationsRoutes,
  lambdaModulesRoutes,
  lambdaModulesErrorsRoutes
} = require('./lib/routes');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = 'Missing required configuration provider parameter! [aca-common-config || aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);

    app.use('/api/v1/auditor/purchase-requests', authByJWTBearerStrategy({ session: false }), purchaseRequestsRoutes);
    app.use('/api/v1/auditor/rules', authByJWTBearerStrategy({ session: false }), rulesRoutes);
    app.use('/api/v1/auditor/rules-messages', authByJWTBearerStrategy({ session: false }), rulesMessagesRoutes);
    app.use('/api/v1/auditor/organizations', authByJWTBearerStrategy({ session: false }), organizationsRoutes);
    app.use('/api/v1/auditor/lambda-modules', authByJWTBearerStrategy({ session: false }), lambdaModulesRoutes);
    app.use('/api/v1/auditor/lambda-modules-errors', authByJWTBearerStrategy({ session: false }), lambdaModulesErrorsRoutes);

    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${initByConfigurationProvider.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
}
