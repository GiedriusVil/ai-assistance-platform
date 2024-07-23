/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IDeleteUserDataByConversationIdParamsV1,
  IDeleteUserDataByConversationIdResponseV1,
  IDeleteUserDataByUserIdParamsV1,
  IDeleteUserDataByUserIdResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

import { deleteManyByConversationId } from './delete-many-by-conversation-id';
import { deleteManyByUserId } from './delete-many-by-user-id';

export const _userData = (
  client: AiServiceClientV1WaV1,
) => {
  const RET_VAL = {
    deleteManyByConversationId: async (
      context: IContextV1,
      params: IDeleteUserDataByConversationIdParamsV1,
    ): Promise<IDeleteUserDataByConversationIdResponseV1> => {
      const TMP_RET_VAL = await deleteManyByConversationId(client, context, params);
      return TMP_RET_VAL;
    },
    deleteManyByUserId: async (
      context: IContextV1,
      params: IDeleteUserDataByUserIdParamsV1,
    ): Promise<IDeleteUserDataByUserIdResponseV1> => {
      const TMP_RET_VAL = await deleteManyByUserId(client, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
