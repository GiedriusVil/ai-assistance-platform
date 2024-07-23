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
  AiServiceClientV1WaV1,
} from '..';

import { retrieveManyByQueryWithValues } from './retrieve-many-by-query-with-values';
import { retrieveManyByQuery } from './retrieve-many-by-query';
import { synchroniseWithinAiSkill } from './synchronise-within-ai-skill';

export const _entities = (
  client: AiServiceClientV1WaV1,
) => {
  const RET_VAL = {
    retrieveManyByQueryWithValues: async (
      context: IContextV1,
      params: IRetrieveAiEntitiesByQueryWithValuesParamsV1,
    ): Promise<IRetrieveAiEntitiesByQueryWithValuesResponseV1> => {
      const TMP_RET_VAL = await retrieveManyByQueryWithValues(client, context, params);
      return TMP_RET_VAL;
    },
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiEntitiesByQueryParamsV1,
    ): Promise<IRetrieveAiEntitiesByQueryResponseV1> => {
      const TMP_RET_VAL = await retrieveManyByQuery(client, context, params);
      return TMP_RET_VAL;
    },
    synchroniseWithinAiSkill: async (
      context: IContextV1,
      params: ISynchroniseAiIntentsWithinAiSkillParamsV1,
    ): Promise<void> => {
      await synchroniseWithinAiSkill(client, context, params);
    },
  };
  return RET_VAL;
}
