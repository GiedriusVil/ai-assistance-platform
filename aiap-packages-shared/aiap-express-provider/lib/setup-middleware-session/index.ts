/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-provider-setup-middleware-session';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const uid = require('uid-safe');
const expressSession = require('express-session');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  cookieParser,
} from '@ibm-aca/aca-wrapper-cookie-parser';

import {
  getLibConfiguration,
  ensureLibConfigurationExists,
} from '../configuration';

import {
  constructExpressRedisStore,
} from './construct-express-redis-store';

const SESSION_KEY = 'JSESSIONID';

export const setupMiddlewareSession = (
  params: {
    app: any,
  },
) => {
  let libConfiguration;

  try {
    ensureLibConfigurationExists();
    libConfiguration = getLibConfiguration();
    if (
      !params?.app
    ) {
      const ERROR_MESSAGE = `Missing required params.app paramere!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !libConfiguration?.session
    ) {
      return;
    }

    // prepare session options
    const OPTIONS: any = {};

    // set key to jsessionid
    OPTIONS.key = SESSION_KEY;

    // set secret to a new hash
    OPTIONS.secret = uid.sync(18);

    // disable resave
    OPTIONS.resave = false;

    // allow storing uninitialized values
    OPTIONS.saveUninitialized = true;

    const EXPRESS_REDIS_CLIENT_NAME = libConfiguration.session?.redisClientName;
    if (
      !lodash.isEmpty(EXPRESS_REDIS_CLIENT_NAME)
    ) {
      OPTIONS.store = constructExpressRedisStore(expressSession, EXPRESS_REDIS_CLIENT_NAME);
    }
    // [2021-11-18] [LEGO] - END - Migration to aiap-redis-client-provider && aca-memory-store-provider libraries!

    // add cookie-pasrser to middleware chain
    params.app.use(cookieParser());

    // add session to middleware chain
    params.app.use(expressSession(OPTIONS));

    params.app.get('/socket.io', (req, res) => res.sendStatus(200));
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setupMiddlewareSession.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
