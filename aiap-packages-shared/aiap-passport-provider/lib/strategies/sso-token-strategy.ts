/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-strategies-sso-strategy';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const jose = require('node-jose');

import {
  Strategy as CustomTokenStrategy,
} from 'passport-custom';

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  execHttpGetRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  usersService,
} from '@ibm-aiap/aiap-app-service';

import {
  getConfiguration,
  getLibConfiguration,
} from '../configuration';

import {
  isTokenValid,
} from '../utils';


const fetchJWKS = async () => {
  try {
    const REQUEST_OPTIONS = {
      url: getConfiguration()?.app?.auth?.sso?.jwkEndpoint,
      hooks: {
        beforeRetry: [
          (options, error, retryCount) => {
            logger.info(`[FETCH_JWK][ERROR][RETRY][${retryCount}] ${ramda.pathOr(500, ['response', 'statusCode'], error)}`);
          },
        ],
      },
      options: {
        timeout: 5000,
        retry: 5

        // {
        //   limit: 5,
        // },
      },
    };
    const result = await execHttpGetRequest({}, REQUEST_OPTIONS);

    const jwkSet = ramda.pathOr({}, ['body'], result);
    logger.info(`[FETCH_JWK] JSON Web Keys Set retrieved`);
    const RET_VAL = await jose.JWK.asKeyStore(jwkSet);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(fetchJWKS.name, {
      ACA_ERROR
    });
    throw ACA_ERROR;
  }
};

export class SSOTokenStrategy {

  static NAME = 'ssoToken';

  static init = (
    passport: any,
  ) => {
    const CONFIG = getLibConfiguration();
    const CONFIGURED_STRATEGIES = CONFIG?.strategies || [];
    if (
      !lodash.isEmpty(CONFIGURED_STRATEGIES)
    ) {
      const STRATEGY = CONFIGURED_STRATEGIES
        .find((
          strategy: {
            name: any,
          }
        ) => {
          const RET_VAL = strategy.name == SSOTokenStrategy.NAME;
          return RET_VAL;
        }
        );


      if (
        !lodash.isEmpty(STRATEGY)
      ) {
        passport.use(SSOTokenStrategy.NAME, this.strategy());
        logger.info(`[${SSOTokenStrategy.NAME}] strategy initialized!`);
      } else {
        logger.warn(`[${SSOTokenStrategy.NAME}] strategy disabled by configuration!`);
      }
    }
  }

  static strategy() {
    const RET_VAL = new CustomTokenStrategy(async (
      req: any,
      done: any,
    ) => {
      const keyStore = await fetchJWKS();
      const token = req.body.token;
      if (
        !token
      ) {
        return done(new Error('Field "token" is missing in body'), false);
      }
      const result = await jose.JWS.createVerify(keyStore).verify(token);
      const payload = JSON.parse(result.payload.toString('utf8'));
      try {
        if (
          !isTokenValid(payload)
        ) {
          logger.debug(`[DEBUG] Expired token`);
          return done(
            new Error('Token is expired!'),
          );
        }

        const SSO_USER = {
          id: payload.email || payload.emailAddress,
          username: payload.email || payload.emailAddress,
          firstName: payload.given_name || payload.firstName,
          lastName: payload.family_name || payload.lastName,
          externalAccessGroups: payload.blueGroups || [],
        };
        logger.debug(`[DEBUG] Verfying User sso record for user name: ${SSO_USER.username}`);
        const CONTEXT = { user: { id: 'system', username: 'system' } };
        const USER = await usersService.loginBySSO(CONTEXT, SSO_USER);
        if (
          !USER
        ) {
          logger.debug(`[DEBUG] Failed to verfied User record`);
          return done(null, {
            found: false
          });
        }
        logger.debug(`[DEBUG] User record verfied successfully`);
        await usersService.updateOneLastLoginTime(CONTEXT,
          {
            value: USER,
          });
        return done(null, {
          found: true,
          user: USER,
        });
      } catch (err) {
        logger.error(`[ERROR] Failed to verify user record`, {
          err
        });
        return done(null, {
          found: false,
          error: err
        });
      }
    });
    return RET_VAL;
  }
}
