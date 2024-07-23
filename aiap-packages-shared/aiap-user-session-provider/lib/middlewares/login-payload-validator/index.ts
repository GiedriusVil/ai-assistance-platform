/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-middlewares-login-payload-validator-middleware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  LOGIN_PAYLOAD_SCHEMA,
} from './login-payload-schema';

export const loginPayloadValidatorMiddleware = () => {
  const MIDDLEWARE = (
    request: any,
    response: any,
    next: any,
  ) => {
    try {
      const LOGIN_PAYLOAD = request?.body;
      const VALIDATION_RESULT = LOGIN_PAYLOAD_SCHEMA.validate(LOGIN_PAYLOAD);
      const VALIDATION_ERROR = VALIDATION_RESULT?.error;

      if (
        lodash.isEmpty(VALIDATION_ERROR)
      ) {
        next();
      } else {
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Login payload malformed');
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(loginPayloadValidatorMiddleware.name, { ACA_ERROR });
      response.status(403).json({ errors: [ACA_ERROR] });
    }
  }
  return MIDDLEWARE;
}
