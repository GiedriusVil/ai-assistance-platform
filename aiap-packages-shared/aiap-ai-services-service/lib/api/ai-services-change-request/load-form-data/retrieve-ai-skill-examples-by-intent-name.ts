/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-change-request-create-new-form-data';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiSkillExternalV1WaV2
} from '@ibm-aiap/aiap--types-server';

import {
  getAiServicesDatasourceByContext,
} from '../../utils/datasource-utils';

export const retrieveAiSkillExamplesByIntentName = async (
  context: IContextV1,
  params: any
) => {
  try {
    const AI_SKILL_ID = params?.aiSkillId;
    const INTENT_NAME = params?.intentName;
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const AI_SKILL = await DATASOURCE.aiSkills.findOneById(context, { id: AI_SKILL_ID });
    const AI_SKILL_INTENTS = (AI_SKILL?.external as IAiSkillExternalV1WaV2).workspace?.intents;
    const AI_SKILL_FILTERED_INTENTS = AI_SKILL_INTENTS?.filter(intent => intent?.intent === INTENT_NAME);
    const AI_SKILL_FILTERED_INTENT_EXAMPLES = AI_SKILL_FILTERED_INTENTS?.[0]?.examples;

    return AI_SKILL_FILTERED_INTENT_EXAMPLES;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveAiSkillExamplesByIntentName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
