/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-gw-validation-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  basicAuthenicationMidleware,
  oauth2TokenAccessAuthenticationMidleware,
} = require('@ibm-aiap/aiap-express-midleware-provider');

const { setConfigurationProvider } = require('./lib/configuration');
const { validationRoutes } = require('./lib/routes');
const {
  addSupportForLegacyBody,
  appendContextToRequestMidleware,
} = require('./lib/middlewares');

const initByConfigurationProvider = async (configurationProvider, app) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = 'Missing required configurationProvider parameter! [aca-common-config || aca-lite-config]';
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
      '/api/v1/validation',
      addSupportForLegacyBody,
      basicAuthenicationMidleware(),
      appendContextToRequestMidleware,
      validationRoutes
    );
    app.use(
      '/api/v2/validation',
      addSupportForLegacyBody,
      oauth2TokenAccessAuthenticationMidleware,
      appendContextToRequestMidleware,
      validationRoutes
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
