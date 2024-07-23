/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiServiceLogsByQueryParamsV1,
  IRetrieveAiServiceLogsByQueryResponseV1,
} from '../../types';

import {
  AiServiceClientV1ChatGptV3,
} from '..';

export const _serviceLogs = (
  client: AiServiceClientV1ChatGptV3,
) => {
  const RET_VAL = {
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiServiceLogsByQueryParamsV1,
    ): Promise<IRetrieveAiServiceLogsByQueryResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
