/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  authByLocalDatasourceStrategy,
  authBySSOTokenStrategy,
  authByJWTBearerStrategy,
} from '@ibm-aiap/aiap-passport-provider';

const ACA_PASSPORT_PROVIDER_PARAMS = {
  session: false
};


import {
  setConfigurationProvider,
} from './lib/configuration';

import {
  authenticationRoutes,
  authorizationRoutes,
} from './lib/routes';

import {
  loginPayloadValidatorMiddleware,
} from './lib/middlewares';

const initByConfigurationProvider = async (
  configurationProvider: any,
  app: any,
) => {
  try {
    if (
      lodash.isEmpty(configurationProvider)
    ) {
      const MESSAGE = 'Missing required configuration provider! [aca-commong-config, aca-lite-config]';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing required app parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    setConfigurationProvider(configurationProvider);

    app.use('/auth', loginPayloadValidatorMiddleware(), authByLocalDatasourceStrategy(ACA_PASSPORT_PROVIDER_PARAMS), authenticationRoutes);
    app.use('/sso-auth', authBySSOTokenStrategy(ACA_PASSPORT_PROVIDER_PARAMS), authenticationRoutes);
    app.use('/authorize', authByJWTBearerStrategy(ACA_PASSPORT_PROVIDER_PARAMS), authorizationRoutes);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

import {
  allowIfHasPagesPermissions,
  allowIfHasActionsPermissions,
  overideSessionTenantByHeaderWare,
  allowIfHasAnyActionsPermissions,
  allowIfHasAnyPagesPermissions,
} from './lib/middlewares';

export {
  initByConfigurationProvider,
  allowIfHasPagesPermissions,
  allowIfHasActionsPermissions,
  overideSessionTenantByHeaderWare,
  allowIfHasAnyActionsPermissions,
  allowIfHasAnyPagesPermissions,
}
