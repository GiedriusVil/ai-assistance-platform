/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteUsersByIds,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  deleteOneById,
} from './delete-one-by-id';

export const deleteManyByIds = async (
  context: IContextV1,
  params: IParamsV1DeleteUsersByIds,
) => {
  const CONTEX_USER_ID = context?.user?.id;
  const PARAMS_IDS = params?.ids;
  const PARAMS_REASON = params?.reason;
  try {
    if (
      lodash.isEmpty(PARAMS_IDS)
    ) {
      const ERROR_MESSAGE = `Missing required params.ids attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isArray(PARAMS_IDS)
    ) {
      const ERROR_MESSAGE = `Wrong type of params.ids attribute! Array required!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const PROMISES = [];

    for (const ID of PARAMS_IDS) {
      PROMISES.push(deleteOneById(context, { id: ID, reason: PARAMS_REASON }))
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEX_USER_ID });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
