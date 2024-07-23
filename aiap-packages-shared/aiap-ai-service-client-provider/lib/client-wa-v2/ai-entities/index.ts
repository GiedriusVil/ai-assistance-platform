/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiEntitiesByQueryParamsV1,
  IRetrieveAiEntitiesByQueryResponseV1,
  IRetrieveAiEntitiesByQueryWithValuesParamsV1,
  IRetrieveAiEntitiesByQueryWithValuesResponseV1,
  ISynchroniseAiIntentsWithinAiSkillParamsV1,
} from '../../types';

import {
  AiServiceClientV1WaV2,
} from '..';

export const _entities = (
  client: AiServiceClientV1WaV2,
) => {
  const RET_VAL = {
    retrieveManyByQueryWithValues: async (
      context: IContextV1,
      params: IRetrieveAiEntitiesByQueryWithValuesParamsV1,
    ): Promise<IRetrieveAiEntitiesByQueryWithValuesResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiEntitiesByQueryParamsV1,
    ): Promise<IRetrieveAiEntitiesByQueryResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    synchroniseWithinAiSkill: async (
      context: IContextV1,
      params: ISynchroniseAiIntentsWithinAiSkillParamsV1,
    ): Promise<void> => {
      //
    }
  };
  return RET_VAL;
}
