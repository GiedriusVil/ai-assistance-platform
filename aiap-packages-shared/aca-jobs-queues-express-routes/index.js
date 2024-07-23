/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  authByJWTBearerStrategy,
  authByJWTQueryParamStrategy
} = require('@ibm-aiap/aiap-passport-provider');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const routes = require('./lib/routes');
const jobsQueuesExportRoutes = require('./lib/routes-export');
const jobsQueuesImportRoutes = require('./lib/routes-import');

const { setConfigurationProvider } = require('./lib/configuration');

const {
  overideSessionTenantByHeadersWare,
} = require('./lib/midleware');

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
      '/api/v1/jobs-queues',
      authByJWTBearerStrategy({ session: false }),
      overideSessionTenantByHeadersWare,
      allowIfHasPagesPermissions('JobsQueuesViewV1'),
      routes,
    );
    app.use(
      '/api/v1/jobs-queues-import',
      authByJWTBearerStrategy({ session: false }),
      overideSessionTenantByHeadersWare,
      allowIfHasPagesPermissions('JobsQueuesViewV1'),
      jobsQueuesImportRoutes,
    );
    app.use(
      '/api/v1/jobs-queues-export',
      authByJWTQueryParamStrategy({ session: false }),
      overideSessionTenantByHeadersWare,
      allowIfHasPagesPermissions('JobsQueuesViewV1'),
      jobsQueuesExportRoutes,
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
