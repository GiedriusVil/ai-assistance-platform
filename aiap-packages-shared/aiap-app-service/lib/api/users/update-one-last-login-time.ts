/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-update-one-last-login-time';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUserLastLoginTime,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  updateOneLastLoginTimeById,
} from './update-one-last-login-time-by-id';

export const updateOneLastLoginTime = async (
  context: IContextV1,
  params: IParamsV1UpdateUserLastLoginTime,
) => {
  const PARAMS_USER_ID = params?.value?.id;
  let updateLastLoginTimeParams;
  try {
    if (
      lodash.isEmpty(PARAMS_USER_ID)
    ) {
      const ERROR_MESSAGE = `Missing mandatory params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    updateLastLoginTimeParams = {
      id: PARAMS_USER_ID,
    }
    const RET_VAL = await updateOneLastLoginTimeById(context, updateLastLoginTimeParams);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(updateOneLastLoginTime.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
