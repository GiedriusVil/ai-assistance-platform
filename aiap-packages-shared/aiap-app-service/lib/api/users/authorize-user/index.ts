/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-authorize-user';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextUserV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { assignSesionAccessGroup } from './assign-session-access-group';
import { assignSessionTenant } from './assign-session-tenant';
import { assignSessionApplication } from './assign-session-application';
import { mergeSessionAccessGroupTenants } from './merge-session-access-group-tenants';

export const authorizeUser = async (
  params: {
    user: IContextUserV1,
    isLogin?: boolean,
  },
) => {
  try {
    const RET_VAL = params?.user;
    const IS_LOGIN = params?.isLogin || false;
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const ERROR_MESSAGE = 'Missing params.user required parameter!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const AUTHORIZATION_OPTIONS = { isLogin: IS_LOGIN };

    await assignSesionAccessGroup(RET_VAL);
    await mergeSessionAccessGroupTenants(RET_VAL);
    await assignSessionTenant(RET_VAL, AUTHORIZATION_OPTIONS);
    await assignSessionApplication(RET_VAL, AUTHORIZATION_OPTIONS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(authorizeUser.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
