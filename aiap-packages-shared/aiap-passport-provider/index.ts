/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const passport = require('passport');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  LocalDatasourceStrategy,
  SSOTokenStrategy,
  JWTBearerStrategy,
  JWTCookieStrategy,
  JWTQueryParamStrategy,
  TradeShiftOAuth2Strategy,
} from './lib/strategies';

import {
  setConfigurationProvider,
} from './lib/configuration';

const initByConfigurationProvider = async (
  provider: any,
  app: any,
) => {
  try {
    if (
      lodash.isEmpty(provider)
    ) {
      const MESSAGE = 'Missing configuration provider!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(app)
    ) {
      const MESSAGE = 'Missing express application!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    setConfigurationProvider(provider);

    app.use(passport.initialize());
    app.use(passport.session());

    LocalDatasourceStrategy.init(passport);
    SSOTokenStrategy.init(passport);
    JWTBearerStrategy.init(passport);
    JWTCookieStrategy.init(passport);
    JWTQueryParamStrategy.init(passport);
    TradeShiftOAuth2Strategy.init(passport);

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(initByConfigurationProvider.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const authByLocalDatasourceStrategy = (params) => {
  return passport.authenticate(LocalDatasourceStrategy.NAME, params);
}

const authBySSOTokenStrategy = (params) => {
  return passport.authenticate(SSOTokenStrategy.NAME, params);
}

const authByJWTBearerStrategy = (params) => {
  return passport.authenticate(JWTBearerStrategy.NAME, params);
}

const authByCookieStrategy = (params) => {
  return passport.authenticate(JWTCookieStrategy.NAME, params);
}

const authByJWTQueryParamStrategy = (params) => {
  return passport.authenticate(JWTQueryParamStrategy.NAME, params);
}

import {
  authorizeByTradeshiftOAuth2Strategy,
} from './lib/authorization-midlewares';

export {
  initByConfigurationProvider,
  authByLocalDatasourceStrategy,
  authBySSOTokenStrategy,
  authByCookieStrategy,
  authByJWTBearerStrategy,
  authByJWTQueryParamStrategy,
  authorizeByTradeshiftOAuth2Strategy,
}
