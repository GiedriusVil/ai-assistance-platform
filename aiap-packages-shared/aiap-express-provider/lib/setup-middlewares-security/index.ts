/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `express-provider-setup-middlewares-security`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const secure = require('express-secure-only');

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
  ensureLibConfigurationExists,
} from '../configuration';

// Default rate limiter window lenght in seconds
const DEFAULT_LIMITER_WINDOW_LENGTH = 30;
// Default max allow request rate in window
const DEFAULT_LIMITER_MAX_REQ_PER_WINDOW = 1000;

export const setupMiddlewaresSecurity = (
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
      const ERROR_MESSAGE = `Missing require params?.app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !libConfiguration?.security
    ) {
      logger.warn('[EXPRESS][SECURITY] Express security NOT enabled. Running unprotected server');
      return;
    }

    params.app.enable('trust proxy');

    const MIDDLEWARE_HELMET = helmet({
      frameguard: libConfiguration?.security?.frameguardEnabled
    })

    params.app.use(MIDDLEWARE_HELMET);

    // 2. redirects http to https
    if (
      libConfiguration?.security?.redirectToSSL
    ) {
      logger.info('[EXPRESS][SECURITY] Running in cloud - setting up HTTPS redirect', { id: 1 });
      params.app.use(secure());
    }

    // 3. rate limiting
    if (
      libConfiguration?.security?.rateLimiting
    ) {
      const CONFIGURATION_RATE_LIMITING = libConfiguration?.security?.rateLimiting;
      const MIDDLEWARE_RATE_LIMITER = rateLimit({
        windowMs: (CONFIGURATION_RATE_LIMITING?.windowSecs || DEFAULT_LIMITER_WINDOW_LENGTH) * 1000, // seconds
        delayMs: 0,
        max: CONFIGURATION_RATE_LIMITING?.maxRequests || DEFAULT_LIMITER_MAX_REQ_PER_WINDOW,
        headers: true,
        message: JSON.stringify({
          error: 'Too many requests, please try again in 30 seconds.',
          code: 429,
        }),
      });
      params.app.use(MIDDLEWARE_RATE_LIMITER);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setupMiddlewaresSecurity.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
