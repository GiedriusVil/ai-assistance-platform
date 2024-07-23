/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-strategies-tradeshift-oauth2-strategy';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const jwt = require('jwt-simple');
const OAuth2Strategy = require('passport-oauth2');
const { Base64 } = require('js-base64');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  getConfiguration,
  getLibConfiguration,
} from '../configuration';

const __parseIdToken = (
  token: any,
) => {
  const decoded = Buffer.from(token.split('.')[1], 'base64').toString();
  const { companyId, sub: username, userId } = JSON.parse(decoded);
  return { companyId, username, userId };
};

const __verifyCallback = (accessToken, refreshToken, results, profile, callback) => {
  const { companyId, userId, username } = __parseIdToken(results.id_token);
  const { expires_in } = results;
  const CURRENT_TIME = new Date();
  const accessTokenExpirationTime = new Date(CURRENT_TIME.getTime() + expires_in * 60000);

  const USER = {
    id: userId,
    username: username,
    company: {
      id: companyId
    },
    token: {
      access: accessToken,
      accessExpiry: accessTokenExpirationTime,
      refresh: refreshToken
    }
  };

  logger.info('-> USER: ', { USER });
  return callback(null, USER);
};

export class TradeShiftOAuth2Strategy {

  static NAME = 'tradeshift';

  static init = (
    passport: any,
  ) => {
    const CONFIG = getConfiguration();
    const LIB_CONFIG = getLibConfiguration();
    const CONFIGURED_STRATEGIES = LIB_CONFIG?.strategies || [];
    if (
      !lodash.isEmpty(CONFIGURED_STRATEGIES)
    ) {
      const STRATEGY = CONFIGURED_STRATEGIES
        .find(
          (
            strategy: {
              name: any,
            }
          ) => {
            const RET_VAL = strategy.name == TradeShiftOAuth2Strategy.NAME;
            return RET_VAL;
          }
        );



      if (
        !lodash.isEmpty(STRATEGY)
      ) {
        const OAUTH2_CONFIG = ramda.path(['app', 'auth', 'oauth2'], CONFIG);
        const OAUTH2_CLIENT_SECRET = ramda.path(['clientSecret'], OAUTH2_CONFIG);

        passport.serializeUser((user, done) => {
          done(null, jwt.encode(user, OAUTH2_CLIENT_SECRET));
        });

        passport.deserializeUser((id, done) => {
          done(null, jwt.decode(id, OAUTH2_CLIENT_SECRET));
        });

        passport.use(TradeShiftOAuth2Strategy.NAME, this.strategy());

        logger.info(`[${TradeShiftOAuth2Strategy.NAME}] strategy initialized!`);
      } else {
        logger.warn(`[${TradeShiftOAuth2Strategy.NAME}] strategy disabled by configuration!`);
      }
    }
  }

  static strategy() {
    const apiUrlToAuthUrl = (tsApiHost) => tsApiHost.replace('/tradeshift/rest/external', '/tradeshift/auth');
    const CONFIG = ramda.path(['app', 'auth', 'oauth2'], getConfiguration());
    const STRATEGY_OPTIONS = {
      authorizationURL: `${apiUrlToAuthUrl(CONFIG.apiHost)}/login`,
      tokenURL: `${apiUrlToAuthUrl(CONFIG.apiHost)}/token`,
      clientID: CONFIG.clientId,
      clientSecret: CONFIG.clientSecret,
      callbackURL: `${CONFIG.appHost}/auth/callback`,
      customHeaders: {
        Authorization: `Basic ${Base64.encode(`${CONFIG.clientId}:${CONFIG.clientSecret}`)}`,
      },
    };
    logger.info('-> STRATEGY_OPTIONS: ', { STRATEGY_OPTIONS });
    const RET_VAL = new OAuth2Strategy(STRATEGY_OPTIONS, __verifyCallback);
    return RET_VAL;
  }
}

