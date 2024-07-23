/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-express-routes';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, formatIntoAcaError, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { authByJWTBearerStrategy } = require('@ibm-aiap/aiap-passport-provider');
const { deserializeDatesInRequestBodyValue, appendAcaContextToRequest } = require(`@ibm-aiap/aiap-utils-express-routes`);

const {
  rulesAuditsRoutes,
  rulesConditionsRoutes,
  rulesSuppliersRoutes,
  rulesRoutes,
  rulesExternalSuppliersRoutes,
} = require('./lib/routes');

const { setConfigurationProvider } = require('./lib/configuration');
const { allowIfHasPagesPermissions } = require('@ibm-aiap/aiap-user-session-provider');

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
      '/api/v1/buy-rules',
      deserializeDatesInRequestBodyValue,
      authByJWTBearerStrategy({ session: false }),
      appendAcaContextToRequest,
      rulesRoutes,
    );
    app.use(
      '/api/v1/buy-rules-conditions',
      deserializeDatesInRequestBodyValue,
      authByJWTBearerStrategy({ session: false }),
      appendAcaContextToRequest,
      rulesConditionsRoutes,
    );
    app.use(
      '/api/v1/buy-rules-suppliers',
      deserializeDatesInRequestBodyValue,
      authByJWTBearerStrategy({ session: false }),
      appendAcaContextToRequest,
      rulesSuppliersRoutes,
    );
    app.use(
      '/api/v1/buy-rules-external-suppliers',
      deserializeDatesInRequestBodyValue,
      authByJWTBearerStrategy({ session: false }),
      appendAcaContextToRequest,
      rulesExternalSuppliersRoutes,
    );
    app.use(
      '/api/v1/buy-rules-audits',
      deserializeDatesInRequestBodyValue,
      authByJWTBearerStrategy({ session: false }),
      allowIfHasPagesPermissions('BuyRulesView'),
      appendAcaContextToRequest,
      rulesAuditsRoutes,
    )
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
