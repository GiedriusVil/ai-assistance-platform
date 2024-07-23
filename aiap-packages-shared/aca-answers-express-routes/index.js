/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-express-routes-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  authByJWTBearerStrategy,
  authByJWTQueryParamStrategy
} = require('@ibm-aiap/aiap-passport-provider');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const routes = require('./lib/routes');
const routesImport = require('./lib/routes-import');
const routesExport = require('./lib/routes-export');

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
    app.use(
      '/api/v1/answer-stores/export',
      authByJWTQueryParamStrategy({ session: false }),
      allowIfHasPagesPermissions('AnswerStoresViewV1'),
      routesExport
    );
    app.use(
      '/api/v1/answer-stores/import',
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('AnswerStoresViewV1'),
      routesImport
    );
    app.use(
      '/api/v1/answer-stores',
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('AnswerStoresViewV1'),
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
