/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { deserializeDatesInRequestBodyQuery } = require(`@ibm-aiap/aiap-utils-express-routes`);

const { authByJWTBearerStrategy, authByJWTQueryParamStrategy } = require('@ibm-aiap/aiap-passport-provider');

const { setConfigurationProvider } = require('./lib/configuration');

const { router } = require('./lib/routes');
const routesImport = require('./lib/routes-import');
const routesExport = require('./lib/routes-export');

const initByConfigurationProvider = async (provider, app) => {
  try {
    if (lodash.isEmpty(provider)) {
      const MESSAGE = 'Missing required provider parameter! [aca-common-config || aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(provider);

    app.use(
      '/api/v1/analytics-live/import',
      authByJWTBearerStrategy({ session: false }),
      routesImport
    );
    app.use(
      '/api/v1/analytics-live/export',
      authByJWTQueryParamStrategy({ session: false }),
      routesExport
    );

    app.use(
      '/api/v1/analytics-live',
      deserializeDatesInRequestBodyQuery,
      authByJWTBearerStrategy({ session: false }),
      router
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
