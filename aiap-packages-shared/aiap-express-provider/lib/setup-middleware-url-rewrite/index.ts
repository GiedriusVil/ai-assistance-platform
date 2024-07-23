/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-provider-setup-middlewares-body-parser';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
  ensureLibConfigurationExists,
} from '../configuration';

export const setupMiddlewareUrlReWrite = (
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

    params?.app.use(
      (req, res, next) => {
        if (
          !libConfiguration.urlRewrite ||
          !libConfiguration.urlRewrite.matchPattern ||
          !libConfiguration.urlRewrite.replacePattern
        ) {
          return next();
        } else {
          const { matchPattern, replacePattern } = libConfiguration.urlRewrite;
          req.url = req.url.replace(new RegExp(matchPattern), replacePattern);
          next();
        }
      }
    );

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setupMiddlewareUrlReWrite.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
