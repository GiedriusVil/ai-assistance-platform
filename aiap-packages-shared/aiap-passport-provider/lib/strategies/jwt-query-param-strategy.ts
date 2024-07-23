/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-strategies-jwt-bearer-strategy';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ExtractJwt,
  Strategy as JwtStrategy,
} from 'passport-jwt';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  transformUserForLogger,
} from '@ibm-aca/aca-data-transformer';

import {
  getJwtProviderV1,
} from '@ibm-aiap/aiap-jwt-provider';

import {
  usersService,
  userSessionsService,
} from '@ibm-aiap/aiap-app-service';

import {
  getLibConfiguration,
} from '../configuration';

import {
  retrieveUserFromJwtPayload,
} from '../utils';

export class JWTQueryParamStrategy {

  static NAME = 'jwtAsQueryParam';

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
            const RET_VAL = strategy.name == JWTQueryParamStrategy.NAME;
            return RET_VAL;
          }
        );

      if (
        !lodash.isEmpty(STRATEGY)
      ) {
        passport.use(JWTQueryParamStrategy.NAME, this.strategy());
        logger.info(`[${JWTQueryParamStrategy.NAME}] strategy initialized!`);
      } else {
        logger.warn(`[${JWTQueryParamStrategy.NAME}] strategy disabled by configuration!`);
      }
    }
  }

  static strategy(
    queryParamName = 'token'
  ) {
    try {
      const STRATEGY_OPTIONS = {
        secretOrKey: getJwtProviderV1().config.retrieveSecret(),
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter(queryParamName),
        passReqToCallback: true,
      };
      const VERIFY_CALLBACK = (
        req: any,
        jwtPayload: any,
        done: any,
      ) => {
        const USER = retrieveUserFromJwtPayload(jwtPayload);

        logger.info('->', {
          user: transformUserForLogger(USER),
        });

        const TOKEN = ExtractJwt.fromUrlQueryParameter(queryParamName)(req);

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
      logger.error(JWTQueryParamStrategy.strategy.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}
