/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-strategies-jwt-cookie-strategy';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  Strategy as JwtStrategy,
} from 'passport-jwt';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getJwtProviderV1,
} from '@ibm-aiap/aiap-jwt-provider';

import {
  transformUserForLogger,
} from '@ibm-aca/aca-data-transformer';

import {
  userSessionsService,
  usersService,
} from '@ibm-aiap/aiap-app-service';

import {
  getLibConfiguration,
} from '../configuration';

import {
  retrieveUserFromJwtPayload,
} from '../utils';

const jwtTokenFromCookieExtractor = (
  cookieTokenName: any,
) => {
  const RET_VAL = (
    request: any,
  ) => {
    let tmpRetVal;
    if (
      request &&
      request.cookies
    ) {
      tmpRetVal = request.cookies[cookieTokenName];
    }
    return tmpRetVal;
  }
  return RET_VAL;
}

export class JWTCookieStrategy {

  static NAME = 'jwtCookieStrategy';

  static init = (
    passport: any,
  ) => {
    const CONFIG = getLibConfiguration();
    const CONFIGURED_STRATEGIES = CONFIG?.strategies || [];
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
            const RET_VAL = strategy.name == JWTCookieStrategy.NAME;
            return RET_VAL;
          }
        );

      if (
        !lodash.isEmpty(STRATEGY)
      ) {
        passport.use(JWTCookieStrategy.NAME, this.strategy());
        logger.info(`[${JWTCookieStrategy.NAME}] strategy initialized!`);
      } else {
        logger.warn(`[${JWTCookieStrategy.NAME}] strategy disabled by configuration!`);
      }
    }
  }

  static strategy(
    cookieTokenName = 'aiap_token'
  ) {
    try {
      const STRATEGY_OPTIONS = {
        secretOrKey: getJwtProviderV1().config.retrieveSecret(),
        jwtFromRequest: jwtTokenFromCookieExtractor(cookieTokenName),
        passReqToCallback: true,
      };
      const VERIFY_CALLBACK = (
        request: any,
        jwtPayload: any,
        done: any,
      ) => {
        const USER = retrieveUserFromJwtPayload(jwtPayload);
        logger.info('->', {
          user: transformUserForLogger(USER),
        });
        const TOKEN = jwtTokenFromCookieExtractor(cookieTokenName)(request)
        const PARAMS = {
          token: TOKEN,
          user: USER
        }

        const CONTEXT = { user: { id: 'system' } };
        userSessionsService.validate(CONTEXT, PARAMS)
          .then((user) => {
            return usersService.authorizeUser({ user });
          })
          .then((user) => {
            return done(null, user);
          })
          .catch((error) => {
            USER.error = error;
            return done(null, USER);
          });
      }
      const RET_VAL = new JwtStrategy(STRATEGY_OPTIONS, VERIFY_CALLBACK);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(JWTCookieStrategy.strategy.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}
