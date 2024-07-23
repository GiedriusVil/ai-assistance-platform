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
  AiServiceClientV1ChatGptV3,
} from '..';

export const _userData = (
  client: AiServiceClientV1ChatGptV3,
) => {
  const RET_VAL = {
    deleteManyByConversationId: async (
      context: IContextV1,
      params: IDeleteUserDataByConversationIdParamsV1,
    ): Promise<IDeleteUserDataByConversationIdResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    deleteManyByUserId: async (
      context: IContextV1,
      params: IDeleteUserDataByUserIdParamsV1,
    ): Promise<IDeleteUserDataByUserIdResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
