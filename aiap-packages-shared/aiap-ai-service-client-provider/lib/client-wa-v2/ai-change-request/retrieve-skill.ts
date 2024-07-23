/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-v2-ai-change-request-retrieve-skill';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import { setTimeout } from 'timers/promises';
import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
  IAiServiceExternalV1WaV2
} from '@ibm-aiap/aiap--types-server';

import {
  AiServiceClientV1WaV2,
} from '..';


import {
  IRetrieveSkillParamsV1,
  IRetrieveSkillsResponseV1,
} from '../../types';


export const retrieveSkill = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: IRetrieveSkillParamsV1,
  count: number = 0
): Promise<IRetrieveSkillsResponseV1> => {

  const AI_CHANGE_REQUEST_SKILL_ID = params?.aiService?.aiSkill?.externalId;
  const ASSISTANT_ID = (client?.aiService?.external as IAiServiceExternalV1WaV2)?.assistantId;
  if (
    lodash.isEmpty(ASSISTANT_ID)
  ) {
    const ERROR_MESSAGE = `Missing required client.aiService.assistantId parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
  }

  const EXPORT_SKILLS_PARAMS = {
    assistantId: ASSISTANT_ID
  };
  
  let workspaceData;

  try {
    if (count === 3) {
      const ERROR_MESSAGE = `Unable to retrieve skill with id ${AI_CHANGE_REQUEST_SKILL_ID}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AI_SERVICE_ERROR, ERROR_MESSAGE);
    }
    workspaceData = await client.assistant.exportSkills(EXPORT_SKILLS_PARAMS);
    const ASSISTANT_SKILLS = workspaceData?.result?.assistant_skills;
    const CHANGE_REQUEST_ACTION_SKILL_ARRAY = ASSISTANT_SKILLS?.filter(skill => skill.skill_id === AI_CHANGE_REQUEST_SKILL_ID);
    const CHANGE_REQUEST_DIALOG_SKILL_ARRAY = ASSISTANT_SKILLS?.filter(skill => skill.skill_id !== AI_CHANGE_REQUEST_SKILL_ID);
    const CHANGE_REQUEST_ACTION_SKILL = CHANGE_REQUEST_ACTION_SKILL_ARRAY?.[0];
    const CHANGE_REQUEST_DIALOG_SKILL = CHANGE_REQUEST_DIALOG_SKILL_ARRAY?.[0];
    if (lodash.isEmpty(CHANGE_REQUEST_ACTION_SKILL)) {
      await setTimeout(5000);
      count = count + 1;
      await retrieveSkill(
        client,
        context,
        params,
        count);
    } else {
      return {
        actionSkill: CHANGE_REQUEST_ACTION_SKILL,
        dialogSkill: CHANGE_REQUEST_DIALOG_SKILL
      };
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveSkill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
