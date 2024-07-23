/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-middlewares-allow-if-has-actions-permissions';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  retrieveSessionPermissions,
} from '../../utils/session-permissions-utils';

import {
  checkActions,
} from './check-actions';

export const allowIfHasActionsPermissions = (
  ...actions
) => {
  const MIDDLEWARE = (
    request: any,
    response: any,
    next: any,
  ) => {
    try {
      const SESSION_PERMISSIONS = retrieveSessionPermissions(request);

      checkActions(SESSION_PERMISSIONS, actions);

      next();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(allowIfHasActionsPermissions.name, { ACA_ERROR });
      response.status(403).json({ errors: [ACA_ERROR] });
    }
  }
  return MIDDLEWARE;
}

