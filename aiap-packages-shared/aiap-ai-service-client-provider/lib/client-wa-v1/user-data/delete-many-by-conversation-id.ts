/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-user-data-delete-many-by-conversation-id';
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
  IDeleteUserDataByConversationIdParamsV1,
  IDeleteUserDataByConversationIdResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

export const deleteManyByConversationId = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: IDeleteUserDataByConversationIdParamsV1,
): Promise<IDeleteUserDataByConversationIdResponseV1> => {
  let conversationId;
  let retVal: IDeleteUserDataByConversationIdResponseV1;
  try {
    conversationId = params?.conversationId;

    if (
      lodash.isEmpty(conversationId)
    ) {
      const MESSAGE = `Missing required params.conversationId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      customerId: conversationId,
    };
    await client.assistant.deleteUserData(PARAMS);
    retVal = {};
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByConversationId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
