/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-strategies-local-datasource-strategy';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  Strategy as LocalStrategy,
} from 'passport-local';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  createAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  usersService,
} from '@ibm-aiap/aiap-app-service';

import {
  getLibConfiguration,
} from '../configuration';

export class LocalDatasourceStrategy {

  static NAME = 'local';

  static init = (
    passport: any,
  ) => {
    const CONFIG = getLibConfiguration();
    const CONFIGURED_STRATEGIES = CONFIG?.strategies || [];
    if (
      !lodash.isEmpty(CONFIGURED_STRATEGIES)
    ) {
      const STRATEGY = CONFIGURED_STRATEGIES
        .find((strategy: {
          name: any,
        }) => {
          const RET_VAL = strategy.name == LocalDatasourceStrategy.NAME;
          return RET_VAL;
        });

      if (
        !lodash.isEmpty(STRATEGY)
      ) {
        passport.use(
          LocalDatasourceStrategy.NAME,
          this.strategy()
        );
        logger.info(`[${this.name}] strategy initialized!`);
      } else {
        logger.warn(`[${this.name}] strategy disabled by configuration!`);
      }
    }
  }

  static strategy() {
    const VERIFY_FUNCTION = async (
      username: any,
      password: any,
      done: any,
    ) => {
      logger.debug(`[DEBUG] Checking native user credentials`);
      let context;
      try {
        logger.info(`AUTHENTICATION_REQUEST`, {
          username: username
        });
        context = {
          user: {
            id: 'system',
          }
        };
        const LOGIN_BY_LOCAL_DATASOURCE_PARAMS = {
          username: username,
          password: password
        };
        const LOGIN_RESULT = await usersService.loginByLocalDatasource(context, LOGIN_BY_LOCAL_DATASOURCE_PARAMS); // user -> session -> just calculated
        const LOGIN_STATUS = LOGIN_RESULT?.status;
        const USER = LOGIN_RESULT?.user;
        if (
          !USER
        ) {
          const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHENTICATION_ERROR, 'USER_NOT_FOUND', {
            username
          });
          logger.error(`AUTHENTICATION_FAILURE`, {
            ACA_ERROR
          });
          return done(null, {
            found: false,
            status: LOGIN_STATUS
          });
        }
        return done(null, {
          found: true,
          user: USER,
          status: LOGIN_STATUS
        });
      } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, {
          context,
          username
        });
        logger.error(`VERIFY_FUNCTION`, {
          ACA_ERROR
        });
        return done(error, false);
      }
    }
    const RET_VAL = new LocalStrategy(VERIFY_FUNCTION);
    return RET_VAL;
  }

}
