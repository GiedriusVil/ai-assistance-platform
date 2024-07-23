/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-change-request-check-change-request-for-intent';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  retrieveAiSkillExamplesByIntentName
} from './retrieve-ai-skill-examples-by-intent-name';

export const checkChangeRequestForIntent = async (
  context: IContextV1,
  params: any
) => {
  try {
    let existingExamples = [];
    const AI_CHANGE_REQUEST = params?.aiChangeRequest;
    const AI_CHANGE_REQUEST_SKILL_ID = AI_CHANGE_REQUEST?.aiService?.aiSkill?.id;
    const AI_CHANGE_REQUEST_INTENTS = AI_CHANGE_REQUEST?.intents;
    const INTENT_NAME = params?.intentName;
    const FILTERED_INTENTS = AI_CHANGE_REQUEST_INTENTS?.filter(intent => intent?.intentName === INTENT_NAME);
    const FILTERED_INTENT = FILTERED_INTENTS?.[0];
    if (lodash.isEmpty(FILTERED_INTENT)) {
      const RETRIEVE_EXAMPLES_PARAMS = {
        aiSkillId: AI_CHANGE_REQUEST_SKILL_ID,
        intentName: INTENT_NAME
      }
      const INTENT_EXAMPLES = await retrieveAiSkillExamplesByIntentName(context, RETRIEVE_EXAMPLES_PARAMS);
      if (!lodash.isEmpty(INTENT_EXAMPLES)) {
        existingExamples = INTENT_EXAMPLES;
      }
      const NEW_INTENT = {
        intentName: INTENT_NAME,
        existingExamples: existingExamples,
        newExamples: [],
        deletedExamples: []
      }

      AI_CHANGE_REQUEST_INTENTS.push(NEW_INTENT);
    }
    return AI_CHANGE_REQUEST;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(checkChangeRequestForIntent.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
