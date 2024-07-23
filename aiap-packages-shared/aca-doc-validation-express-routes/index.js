/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-express-routes-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  docValidationV1Routes,
  docValidationV2Routes,
  auditsRoutes,
} = require('./lib/routes');
const { setConfigurationProvider } = require('./lib/configuration');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { deserializeDatesInRequestBodyValue, appendAcaContextToRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { authByJWTBearerStrategy } = require('@ibm-aiap/aiap-passport-provider');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = `Missing required configuration provider parameter! [aca-common-config || aca-lite-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = `Missing required app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
    app.use('/api/v1/doc-validation', docValidationV1Routes);
    app.use('/api/v2/doc-validation', docValidationV2Routes);
    app.use(
      '/api/v1/doc-validation-audits',
      deserializeDatesInRequestBodyValue,
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('DocValidationTransactionViewV1'),
      appendAcaContextToRequest,
      auditsRoutes,
    );

    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
}
