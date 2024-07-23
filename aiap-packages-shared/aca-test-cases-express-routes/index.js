/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-express-routes-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { routes } = require('./lib/routes');
const { transformRoutes } = require('./lib/routes/transform-one');
const { routesImport } = require('./lib/routes-import');
const { routesExport } = require('./lib/routes-export');


const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { authByJWTBearerStrategy, authByJWTQueryParamStrategy } = require('@ibm-aiap/aiap-passport-provider');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = `Missing required configuration provider parameter! [aca-lite-config || aca-common-config]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = `Missing required app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);

    app.use('/api/v1/test-cases/transform-one', transformRoutes);
    app.use('/api/v1/test-cases-import', authByJWTBearerStrategy({ session: false }), routesImport);
    app.use('/api/v1/test-cases-export', authByJWTQueryParamStrategy({ session: false }), routesExport);
    app.use('/api/v1/test-cases', authByJWTBearerStrategy({ session: false }), routes);

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
