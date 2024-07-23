/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiServicesByQueryParamsV1,
  IRetrieveAiServicesByQueryResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV2,
} from '..';

import { retrieveManyByQuery } from './retrieve-many-by-query';

export const _services = (
  client: AiServiceClientV1WaV2,
) => {
  const RET_VAL = {
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiServicesByQueryParamsV1,
    ): Promise<IRetrieveAiServicesByQueryResponseV1> => {
      const TMP_RET_VAL = await retrieveManyByQuery(client, context, params);
      return TMP_RET_VAL;
    },
  };
  return RET_VAL;
}
