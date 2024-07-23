/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'express-midleware-provider-configuration-middleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getConfiguration,
} from '../configuration';

export const allowIfHasConfigurationPermission = (
  path: any,
) => {
  const RET_VAL = (
    request,
    response,
    next,
  ) => {
    try {
      const CONFIGURATION = getConfiguration();
      const IS_ENABLED = ramda.path(path?.split('.'), CONFIGURATION);
      if (
        !IS_ENABLED
      ) {
        const MESSAGE = 'Endpoint is disabled by configuration!';
        response.status(403).json({ MESSAGE });
      } else {
        next();
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(allowIfHasConfigurationPermission.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
  return RET_VAL;

}
