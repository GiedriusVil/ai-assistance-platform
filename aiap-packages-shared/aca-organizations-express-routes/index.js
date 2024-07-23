/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { authByJWTBearerStrategy } = require('@ibm-aiap/aiap-passport-provider');

const { setConfigurationProvider, getConfiguration } = require('./lib/configuration');

const { organizationsRoutes, organizationsImportRoutes } = require('./lib/routes');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    setConfigurationProvider(configurationProvider);
    if (
      lodash.isEmpty(app)
    ) {
      const ACA_ERROR = {
        type: 'SYSTEM_ERROR',
        message: `[${MODULE_ID}] Missing app instance!`
      };
      throw ACA_ERROR;
    }
    const CONFIG = getConfiguration();

    await require('./lib/auth').initAuthorizationByConfiguration(CONFIG, organizationsRoutes);

    app.use('/api/external/organizations', organizationsRoutes);
    app.use('/api/organizations', authByJWTBearerStrategy({ session: false }), organizationsRoutes);
    app.use('/api/import/organizations', authByJWTBearerStrategy({ session: false }), organizationsImportRoutes);

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
