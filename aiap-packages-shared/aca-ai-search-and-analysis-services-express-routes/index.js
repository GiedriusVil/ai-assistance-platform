/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-search-and-analysis-services-express-routes-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  authByJWTBearerStrategy,
  authByJWTQueryParamStrategy,
} = require('@ibm-aiap/aiap-passport-provider');

const {
  allowIfHasPagesPermissions,
  overideSessionTenantByHeaderWare,
} = require('@ibm-aiap/aiap-user-session-provider');

const { routes } = require('./lib/routes');
const { routesExport } = require('./lib/routes-export');
const { routesImport } = require('./lib/routes-import');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    setConfigurationProvider(configurationProvider);
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    app.use(
      '/api/v1/search-and-analysis/export',
      authByJWTQueryParamStrategy({ session: false }),
      overideSessionTenantByHeaderWare,
      allowIfHasPagesPermissions('AiSearchAndAnalysisServicesViewV1'),
      routesExport
    );
    app.use(
      '/api/v1/search-and-analysis/import',
      authByJWTBearerStrategy({ session: false }),
      overideSessionTenantByHeaderWare,
      allowIfHasPagesPermissions('AiSearchAndAnalysisServicesViewV1'),
      routesImport
    );
    app.use(
      '/api/v1/search-and-analysis',
      authByJWTBearerStrategy({ session: false }),
      overideSessionTenantByHeaderWare,
      allowIfHasPagesPermissions('AiSearchAndAnalysisServicesViewV1'),
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
