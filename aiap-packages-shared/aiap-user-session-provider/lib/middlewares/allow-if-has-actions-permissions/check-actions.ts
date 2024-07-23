/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-middlewares-allow-if-has-session-permissions-check-actions';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  createAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const checkActions = (
  permissions: any,
  actions: any,
) => {
  try {
    if (
      !lodash.isEmpty(actions) &&
      lodash.isArray(actions)
    ) {
      const ALLOWED_ACTIONS = ramda.pathOr([], ['allowedActions'], permissions);
      let hasAllActions = true;
      let missingAction;

      for (const ACTION of actions) {
        const IS_ACTION_ALLOWED = lodash.has(ALLOWED_ACTIONS, ACTION);
        if (
          !IS_ACTION_ALLOWED
        ) {
          hasAllActions = false;
          missingAction = ACTION;
          break;
        }
      }
      if (
        !hasAllActions
      ) {
        const MESSAGE = `Missing ${missingAction} action permission!`;
        const ACA_ERROR = createAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHORIZATION_ERROR, MESSAGE);
        throw ACA_ERROR;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(checkActions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
