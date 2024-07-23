/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { routes } = require('./lib/routes');
const classifierImportRoutes = require('./lib/routes-import');
const classifierExportRoutes = require('./lib/routes-export');

const { setConfigurationProvider } = require('./lib/configuration');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  overrideSessionTenantByHeadersWare,
} = require('./lib/midleware');

const {
  authByJWTBearerStrategy,
  authByJWTQueryParamStrategy
} = require('@ibm-aiap/aiap-passport-provider');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);

    app.use(
      '/api/v1/classifier-export',
      authByJWTQueryParamStrategy({ session: false }),
      overrideSessionTenantByHeadersWare,
      allowIfHasPagesPermissions('ClassifierModelsView'),
      classifierExportRoutes
    );
    app.use(
      '/api/v1/classifier-import',
      authByJWTBearerStrategy({ session: false }),
      overrideSessionTenantByHeadersWare,
      allowIfHasPagesPermissions('ClassifierModelsView'),
      classifierImportRoutes
    );
    app.use(
      '/api/v1/classifier',
      authByJWTBearerStrategy({ session: false }),
      overrideSessionTenantByHeadersWare,
      allowIfHasPagesPermissions('ClassifierModelsView'),
      routes
    );
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
