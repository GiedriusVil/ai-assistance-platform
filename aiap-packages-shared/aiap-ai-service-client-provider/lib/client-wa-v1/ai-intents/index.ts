/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiIntentsByQueryWithExamplesParamsV1,
  IRetrieveAiIntentsByQueryWithExamplesResponseV1,
  IRetrieveAiIntentsByQueryParamsV1,
  IRetrieveAiIntentsByQueryResponseV1,
  ISynchroniseAiIntentsWithinAiSkillParamsV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

import { retrieveManyByQueryWithExamples } from './retrieve-many-by-query-with-examples';
import { retrieveManyByQuery } from './retrieve-many-by-query';
import { synchroniseWithinAiSkill } from './synchronise-within-ai-skill';

export const _intents = (
  client: AiServiceClientV1WaV1,
) => {
  const RET_VAL = {
    retrieveManyByQueryWithExamples: async (
      context: IContextV1,
      params: IRetrieveAiIntentsByQueryWithExamplesParamsV1,
    ): Promise<IRetrieveAiIntentsByQueryWithExamplesResponseV1> => {
      const TMP_RET_VAL = await retrieveManyByQueryWithExamples(client, context, params);
      return TMP_RET_VAL;
    },
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiIntentsByQueryParamsV1,
    ): Promise<IRetrieveAiIntentsByQueryResponseV1> => {
      const TMP_RET_VAL = await retrieveManyByQuery(client, context, params);
      return TMP_RET_VAL;
    },
    synchroniseWithinAiSkill: async (
      context: IContextV1,
      params: ISynchroniseAiIntentsWithinAiSkillParamsV1,
    ) => {
      await synchroniseWithinAiSkill(client, context, params);
    },
  };
  return RET_VAL;
}
