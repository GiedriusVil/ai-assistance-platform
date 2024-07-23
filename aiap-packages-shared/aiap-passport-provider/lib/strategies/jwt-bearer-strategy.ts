/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-strategies-jwt-bearer-strategy';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ExtractJwt,
  Strategy as JwtStrategy,
} from 'passport-jwt';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

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


export class JWTBearerStrategy {

  static NAME = 'jwtAsBearerToken';

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
            const RET_VAL = strategy.name == JWTBearerStrategy.NAME;
            return RET_VAL;
          }
        );

      if (
        !lodash.isEmpty(STRATEGY)
      ) {
        passport.use(JWTBearerStrategy.NAME, this.strategy());
        logger.info(`[${JWTBearerStrategy.NAME}] strategy initialized!`);
      } else {
        logger.warn(`[${JWTBearerStrategy.NAME}] strategy disabled by configuration!`);
      }
    }
  }

  static verifyCallback = (
    req: any,
    jwtPayload: any,
    done: any,
  ) => {
    let context: IContextV1;
    let contextUserId;
    let params;
    let paramsUserId;
    try {
      context = { user: { id: 'system' } };
      contextUserId = context?.user?.id;

      const USER = retrieveUserFromJwtPayload(jwtPayload);
      const TOKEN = ExtractJwt.fromAuthHeaderAsBearerToken('token')(req);

      params = { token: TOKEN, user: USER };
      paramsUserId = params?.user?.id;
      userSessionsService.validate(context, params)
        .then((user) => {
          return usersService.authorizeUser({ user });
        })
        .then((user) => {
          return done(null, user);
        })
        .catch((error) => {
          if (
            ACA_ERROR_TYPE.AUTHENTICATION_ERROR === error?.type
          ) {
            return done(null, false);
          } else {
            return done(error);
          }
        });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { contextUserId, paramsUserId });
      logger.error(JWTBearerStrategy.verifyCallback.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  static strategy() {
    try {
      const STRATEGY_OPTIONS = {
        secretOrKey: getJwtProviderV1().config.retrieveSecret(),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
      };
      const RET_VAL = new JwtStrategy(STRATEGY_OPTIONS, JWTBearerStrategy.verifyCallback);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(JWTBearerStrategy.strategy.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}
