/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v2-user-data-delete-many-by-user-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IDeleteUserDataByUserIdParamsV1,
  IDeleteUserDataByUserIdResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV2,
} from '..';


export const deleteManyByUserId = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: IDeleteUserDataByUserIdParamsV1,
): Promise<IDeleteUserDataByUserIdResponseV1> => {
  let userId;

  let retVal: IDeleteUserDataByUserIdResponseV1;
  try {
    userId = params?.userId;

    if (
      lodash.isEmpty(userId)
    ) {
      const MESSAGE = `Missing required params.userId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PARAMS = {
      customerId: userId,
    };
    await client.assistant.deleteUserData(PARAMS);
    retVal = {};
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByUserId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
