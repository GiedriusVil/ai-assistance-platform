/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { authByJWTBearerStrategy } = require('@ibm-aiap/aiap-passport-provider');

const { setConfigurationProvider } = require('./lib/configuration');

const { metricsRoutes, docValidationMetricsRoutes } = require('./lib/routes');
const { appendAcaContextToRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = `Missing required configuration provider! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = `Missing required app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
    app.use(
      '/api/metrics',
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('LiveMetricsView'),
      metricsRoutes
    );

    app.use(
      '/api/v1/doc-validation-metrics',
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('DocValidationMetricsView'),
      appendAcaContextToRequest,
      docValidationMetricsRoutes
    );

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
