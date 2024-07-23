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
  AiServiceClientV1ChatGptV3,
} from '..';

export const _intents = (
  client: AiServiceClientV1ChatGptV3,
) => {
  const RET_VAL = {
    retrieveManyByQueryWithExamples: async (
      context: IContextV1,
      params: IRetrieveAiIntentsByQueryWithExamplesParamsV1,
    ): Promise<IRetrieveAiIntentsByQueryWithExamplesResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiIntentsByQueryParamsV1,
    ): Promise<IRetrieveAiIntentsByQueryResponseV1> => {
      const TMP_RET_VAL = null;
      return TMP_RET_VAL;
    },
    synchroniseWithinAiSkill: async (
      context: IContextV1,
      params: ISynchroniseAiIntentsWithinAiSkillParamsV1,
    ) => {
      //
    },
  };
  return RET_VAL;
}
