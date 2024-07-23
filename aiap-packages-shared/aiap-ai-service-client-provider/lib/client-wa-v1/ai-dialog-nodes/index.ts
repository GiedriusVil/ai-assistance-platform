/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveAiDialogNodesByQueryParamsV1,
  IRetrieveAiDialogNodesByQueryResponseV1,
  ISynchroniseAiDialogNodesWithinAiSkillParamsV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

import { retrieveManyByQuery } from './retrieve-many-by-query';
import { synchroniseWithinAiSkill } from './synchronise-within-ai-skill';

export const _dialogNodes = (
  client: AiServiceClientV1WaV1,
) => {
  const RET_VAL = {
    retrieveManyByQuery: async (
      context: IContextV1,
      params: IRetrieveAiDialogNodesByQueryParamsV1,
    ): Promise<IRetrieveAiDialogNodesByQueryResponseV1> => {
      const TMP_RET_VAL = await retrieveManyByQuery(client, context, params);
      return TMP_RET_VAL;
    },
    synchroniseWithinAiSkill: async (
      context: IContextV1,
      params: ISynchroniseAiDialogNodesWithinAiSkillParamsV1,
    ): Promise<void> => {
      await synchroniseWithinAiSkill(client, context, params);
    }
  };
  return RET_VAL;
}
