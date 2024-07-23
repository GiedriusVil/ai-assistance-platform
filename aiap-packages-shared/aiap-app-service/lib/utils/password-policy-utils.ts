/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-password-policy-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  getConfiguration,
} from '../configuration';

export const validateUserPassword = (
  user: any,
) => {
  const CONFIGURATION = getConfiguration();
  const PASSWORD_REQUIREMENTS_CONFIG = ramda.path(['app', 'passwordPolicyRegexp'], CONFIGURATION);
  const PASSWORD_REQUIREMENTS_REGEXP = new RegExp(PASSWORD_REQUIREMENTS_CONFIG);

  const USER_PASSWORD = ramda.path(['password'], user);
  const PASSWORD_VALID = PASSWORD_REQUIREMENTS_REGEXP.test(USER_PASSWORD);

  if (!PASSWORD_VALID) {
    const PASSWORD_REQUIREMENTS_MESSAGE = ramda.path(['app', 'passwordPolicyMessage'], CONFIGURATION);
    const ACA_ERROR = {
      type: 'VALIDATION_ERROR',
      message: `${PASSWORD_REQUIREMENTS_MESSAGE}`,
    }
    logger.error(validateUserPassword.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

