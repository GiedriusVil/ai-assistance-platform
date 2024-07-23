/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-middlewares-allow-if-has-any-actions-permissions-check-any-actions';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const checkAnyActions = (
  permissions: any,
  actions: any,
) => {
  try {
    if (
      !lodash.isEmpty(actions) &&
      lodash.isArray(actions)
    ) {
      const ALLOWED_ACTIONS = ramda.pathOr([], ['allowedActions'], permissions);
      let hasAnyActions = false;
      for (const ACTION of actions) {
        const IS_ACTION_ALLOWED = lodash.has(ALLOWED_ACTIONS, ACTION);
        if (
          IS_ACTION_ALLOWED
        ) {
          hasAnyActions = true;
          break;
        }
      }
      if (
        !hasAnyActions
      ) {
        const ACA_ERROR = {
          type: ACA_ERROR_TYPE.AUTHORIZATION_ERROR,
          message: `[${MODULE_ID}] Missing any ${actions} action permission!`
        };
        throw ACA_ERROR;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(checkAnyActions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
