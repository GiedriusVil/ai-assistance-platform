/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-provider-setup-middleware-cors';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const cors = require('cors');

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
  ensureLibConfigurationExists,
} from '../configuration';

const _middlewareCors = () => {
  const RET_VAL = cors((req, cb) => {
    let libConfiguration;
    try {
      libConfiguration = getLibConfiguration();
      if (
        req.headers.origin &&
        libConfiguration?.cors?.whitelist &&
        libConfiguration?.cors?.whitelist.indexOf(req.headers.origin) !== -1
      ) {
        logger.debug('[EXPRESS][SECURITY] Using CORS for request', { id: 2 });
        cb(null, {
          origin: true,
          credentials: true,
        }); // reflect (enable) the requested origin in the CORS response
      } else {
        cb(null, {
          origin: false,
        }); // disable CORS for this request
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(_middlewareCors.name, { ACA_ERROR });
    }
  });
  return RET_VAL;
}

export const setupMiddlewareCors = (
  params: {
    app: any,
  }
) => {
  let libConfiguration;
  try {
    ensureLibConfigurationExists();
    libConfiguration = getLibConfiguration();
    if (
      !params?.app
    ) {
      const ERROR_MESSAGE = `Missing required params?.app parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, ERROR_MESSAGE);
    }
    if (
      libConfiguration?.cors?.whitelist
    ) {
      params.app.use((req, res, next) => next());
    } else {
      params.app.use(_middlewareCors());
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setupMiddlewareCors.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
