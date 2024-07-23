/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { authByJWTBearerStrategy, authByJWTQueryParamStrategy } = require('@ibm-aiap/aiap-passport-provider');

const routes = require('./lib/routes');
const routesImport = require('./lib/routes-import');
const routesExport = require('./lib/routes-export');

const { setConfigurationProvider } = require('./lib/configuration');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = 'Missing required configuration provider parameter! [aca-common-config, aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);
    app.use(
      '/api/v1/validation-engagements/import',
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('ValidationEngagementsViewV1'),
      routesImport
    );
    app.use(
      '/api/v1/validation-engagements/export',
      authByJWTQueryParamStrategy({ session: false }),
      allowIfHasPagesPermissions('ValidationEngagementsViewV1'),
      routesExport
    );
    app.use(
      '/api/v1/validation-engagements',
      authByJWTBearerStrategy({ session: false }),
      routes
    );
    logger.info('INITIALIZED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  initByConfigurationProvider,
}
