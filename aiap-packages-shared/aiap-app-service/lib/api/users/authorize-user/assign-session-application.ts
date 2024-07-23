/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-authorize-user-retrieve-session-application';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextApplicationV1,
  IContextUserV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import * as _applicationsService from '../../applications';

const _identifyApplicationId = (
  user: IContextUserV1,
) => {
  let retVal;

  const LAST_SESSION_APPLICATION_ID = user?.lastSession?.application?.id;

  const CURR_SESSION_TENANT_APPS = user?.session?.tenant?.applications;

  if (
    !lodash.isEmpty(LAST_SESSION_APPLICATION_ID) &&
    lodash.isArray(CURR_SESSION_TENANT_APPS)
  ) {
    for (const APPLICATION of CURR_SESSION_TENANT_APPS) {
      const APP_ID = APPLICATION?.id;
      if (
        APP_ID === LAST_SESSION_APPLICATION_ID
      ) {
        retVal = LAST_SESSION_APPLICATION_ID;
        break;
      }
    }
  }
  if (
    lodash.isEmpty(retVal)
  ) {
    const CURR_SESSION_TENANT_APP_FIRST: IContextApplicationV1 = ramda.path([0], CURR_SESSION_TENANT_APPS);
    retVal = CURR_SESSION_TENANT_APP_FIRST?.id;
  }
  return retVal;
}

export const assignSessionApplication = async (
  user: IContextUserV1,
  options: any,
) => {
  try {
    const CONTEXT = { user };
    const SESSION_APPLICATION_ID = _identifyApplicationId(user);
    const PARAMS = { id: SESSION_APPLICATION_ID };
    if (
      !lodash.isEmpty(SESSION_APPLICATION_ID)
    ) {
      const APPLICATION = await _applicationsService.findOneById(CONTEXT, PARAMS);
      user.session.application = APPLICATION;
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(assignSessionApplication.name, { ACA_ERROR });
    throw ACA_ERROR
  }
}

