/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-change-request-create-new-form-data';
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

export const createNewFormData = async (
  context: IContextV1,
  params: any
) => {
  try {
    let existingExamples = [];
    const PARAMS_VALUE = params?.value;
    const INTENT_NAME = PARAMS_VALUE?.intentName;
    const AI_SERVICE = PARAMS_VALUE?.aiService;
    const AI_SKILL_ID = AI_SERVICE?.aiSkill?.id;
    const RETRIEVE_EXAMPLES_PARAMS = {
      aiSkillId: AI_SKILL_ID,
      intentName: INTENT_NAME
    }
    const AI_SKILL_EXAMPLES = await retrieveAiSkillExamplesByIntentName(context, RETRIEVE_EXAMPLES_PARAMS);

    if (!lodash.isEmpty(AI_SKILL_EXAMPLES)) {
      existingExamples = AI_SKILL_EXAMPLES;
    }

    const INTENTS = [];
    const NEW_INTENT = {
      intentName: INTENT_NAME,
      deletedExamples: [],
      newExamples: [],
      existingExamples: existingExamples

    }
    INTENTS.push(NEW_INTENT);
    const NEW_CHANGE_REQUEST = {
      aiService: AI_SERVICE,
      intents: INTENTS
    };

    return NEW_CHANGE_REQUEST;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createNewFormData.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
