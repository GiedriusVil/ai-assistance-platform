/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-middlewares-allow-if-has-pages-permissions';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  retrieveSessionPermissions,
} from '../../utils/session-permissions-utils';

import {
  checkViews,
} from './check-views';

// [LEGO] -> WE NEED TO RENAME this function!!!! -> allowIfHasViewsPermissions
export const allowIfHasPagesPermissions = (
  ...views
) => {
  const MIDDLEWARE = (
    request: any,
    response: any,
    next: any,
  ) => {
    try {
      const SESSION_PERMISSIONS = retrieveSessionPermissions(request);

      checkViews(SESSION_PERMISSIONS, views);
      next();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(allowIfHasPagesPermissions.name, { ACA_ERROR });
      response.status(403).json({ errors: [ACA_ERROR] });
    }
  }
  return MIDDLEWARE;
}
