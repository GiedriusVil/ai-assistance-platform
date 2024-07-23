/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IRetrieveSkillsResponseV1,
  IRetrieveSkillParamsV1,
  IFormatIntentsParamsV1,
  IFormatIntentsResponseV1,
  IImportSkillsParamsV1,
  IImportSkillsResponseV1

} from '../../types';

import {
  AiServiceClientV1WaV2,
} from '..';

import { retrieveSkill } from './retrieve-skill';
import { formatIntents } from './format-intents';
import { importSkills } from './import-skills';

export const _changeRequest = (
  client: AiServiceClientV1WaV2,
) => {
  const RET_VAL = {
    retrieveSkill: async (
      context: IContextV1,
      params: IRetrieveSkillParamsV1,
    ): Promise<IRetrieveSkillsResponseV1> => {
      const TMP_RET_VAL = await retrieveSkill(client, context, params);
      return TMP_RET_VAL;
    },
    formatIntents: async (
      context: IContextV1,
      params: IFormatIntentsParamsV1,
    ): Promise<IFormatIntentsResponseV1> => {
      const TMP_RET_VAL = await formatIntents(client, context, params);
      return TMP_RET_VAL;
    },
    importSkills: async (
      context: IContextV1,
      params: IImportSkillsParamsV1,
    ): Promise<void> => {
      const TMP_RET_VAL = await importSkills(client, context, params);
      return TMP_RET_VAL;
    }
  };
  return RET_VAL;
}
