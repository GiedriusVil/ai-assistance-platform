/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'passport-provider-authorization-midlewares-authorize-by-tradeshift-oauth2-strategy';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const passport = require('passport');
const jwt = require('jwt-simple');
const querystring = require('querystring');

declare const Buffer;

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getConfiguration,
} from '../configuration';

const { TradeShiftOAuth2Strategy } = require('../strategies');

const __refreshAccessToken = async (
  req: any,
  res: any,
  next: any,
) => {
  // TODO --> following is wrong need refactoring
  const CONFIG = ramda.path(['app', 'auth', 'oauth2'], getConfiguration());
  const CLIENT_ID = CONFIG?.clientId;
  const CLIENT_SECRET = CONFIG?.clientSecret;
  const apiUrlToAuthUrl = (tsApiHost) => tsApiHost.replace('/tradeshift/rest/external', '/tradeshift/auth');
  const TOKEN_URL = `${apiUrlToAuthUrl(CONFIG.apiHost)}/token`;
  const USER = req?.user;
  const REFRESH_TOKEN = USER?.token?.refresh;
  const AUTHORIZATION = `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64')}`;

  if (
    !lodash.isEmpty(REFRESH_TOKEN)
  ) {
    const OPTIONS = {
      url: TOKEN_URL,
      headers: {
        'Authorization': AUTHORIZATION,
        'content-type': 'application/x-www-form-urlencoded'
      },
    };
    const ADDITIONAL_OPTIONS = {
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
        scope: CLIENT_ID,
      }),
    }

    const RESPONSE: any = await execHttpPostRequest({}, OPTIONS, ADDITIONAL_OPTIONS);

    const DATA = RESPONSE?.data;
    if (
      !lodash.isEmpty(DATA)
    ) {
      const ACCESS_TOKEN = DATA?.access_token;
      const REFRESH_TOKEN = DATA?.refresh_token;
      const EXPIRES_IN = DATA?.expires_in;

      const TOKEN_EXPIRATION_TIME = new Date(new Date().getTime() + EXPIRES_IN * 600);

      USER.token.access = ACCESS_TOKEN;
      USER.token.refresh = REFRESH_TOKEN;

      req.session.passport.user = jwt.encode(USER, CLIENT_SECRET);
      req.session.accessTokenExpirationTime = TOKEN_EXPIRATION_TIME;

      logger.info(`[${MODULE_ID}] tokens refreshed!`);

      next();
    } else {
      logger.error(`[${MODULE_ID}] No data found in response`)
    }
  }
}

export const authorizeByTradeshiftOAuth2Strategy = async (
  req: any,
  res: any,
  next: any,
) => {
  const ERRORS = [];
  try {
    const TOKEN_PATH = '/auth/token';
    const REDIRECT_PATH = '/auth/callback';
    const REQUEST_PATH = req?.path;
    const REQUEST_METHOD = req?.method;
    const IS_UNAUTHENTIACTED = req.isUnauthenticated();

    if (
      REQUEST_METHOD === 'GET' &&
      REQUEST_PATH === TOKEN_PATH
    ) {
      return passport.authenticate(TradeShiftOAuth2Strategy.name, { scope: 'openid offline' })(req, res, next);
    }
    if (
      REQUEST_METHOD === 'GET' &&
      REQUEST_PATH === REDIRECT_PATH
    ) {
      return passport.authenticate(TradeShiftOAuth2Strategy.name, { successRedirect: '/', failureRedirect: '/' })(req, res, next);
    }
    if (
      IS_UNAUTHENTIACTED
    ) {
      return res.redirect(TOKEN_PATH);
    }

    const CURRENT_TIME = new Date();
    const INITIAL_EXPIRATION_TIME = req?.user?.token?.accessExpiry
    let accessTokenExpirationTime = req?.session?.accessTokenExpirationTime;

    if (
      !accessTokenExpirationTime
    ) {
      accessTokenExpirationTime = new Date(INITIAL_EXPIRATION_TIME);
    } else {
      accessTokenExpirationTime = new Date(accessTokenExpirationTime);
    }

    if (
      CURRENT_TIME > accessTokenExpirationTime
    ) {
      return __refreshAccessToken(req, res, next);
    } else {
      return next();
    }

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(authorizeByTradeshiftOAuth2Strategy.name, { ACA_ERROR });
    ERRORS.push(ACA_ERROR);
    res.status(500).json({ errors: ERRORS });
  }
}
