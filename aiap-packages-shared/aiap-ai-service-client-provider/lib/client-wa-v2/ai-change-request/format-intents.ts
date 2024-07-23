/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-v2-ai-change-request-format-intents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AiServiceClientV1WaV2,
} from '..';


import {
  IFormatIntentsParamsV1,
} from '../../types';

const deleteIntentExamples = (params) => {
  const SKILL = params?.skill;
  const SKILL_WORKSPACE = SKILL?.workspace;
  const SKILL_INTENTS = SKILL_WORKSPACE?.intents;
  const CHANGE_REQUEST_INTENTS = params?.intents;

  if (
    !lodash.isEmpty(CHANGE_REQUEST_INTENTS)
  ) {
    CHANGE_REQUEST_INTENTS.forEach(intent => {
      const EXAMPLES_TO_DELETE = intent?.deletedExamples;
      const INTENT_NAME = intent?.intentName;
      if (
        !lodash.isEmpty(EXAMPLES_TO_DELETE) &&
        !lodash.isEmpty(SKILL_INTENTS)
      ) {
        const INTENT_INDEX = SKILL_INTENTS.findIndex(intent => intent.intent === INTENT_NAME);
        const INTENT_OBJECT = SKILL_INTENTS.filter(intent => intent.intent === INTENT_NAME);
        const INTENT_EXAMPLES = INTENT_OBJECT?.[0]?.examples;
        const EXAMPLES_TO_DELETE_TEXTS = EXAMPLES_TO_DELETE.map(example => {
          return example.text;
        })
        const FILTERED_EXAMPLES = INTENT_EXAMPLES.filter(example => !EXAMPLES_TO_DELETE_TEXTS.includes(example.text))
        params.skill.workspace.intents[INTENT_INDEX].examples = FILTERED_EXAMPLES;
      }
    })

  }
}

const addIntentExamples = (params) => {
  const SKILL = params?.skill;
  const SKILL_WORKSPACE = SKILL?.workspace;
  const SKILL_INTENTS = SKILL_WORKSPACE?.intents;
  const CHANGE_REQUEST_INTENTS = params?.intents;
  if (
    !lodash.isEmpty(CHANGE_REQUEST_INTENTS)
  ) {
    CHANGE_REQUEST_INTENTS.forEach(intent => {
      const EXAMPLES_TO_ADD = intent?.newExamples;
      const INTENT_NAME = intent?.intentName;

      if (
        !lodash.isEmpty(EXAMPLES_TO_ADD) &&
        !lodash.isEmpty(SKILL_INTENTS)
      ) {
        const INTENT_INDEX = SKILL_INTENTS.findIndex(intent => intent.intent === INTENT_NAME);
        EXAMPLES_TO_ADD.forEach(example => {
          if (!lodash.isEmpty(example?.text)) {
            params.skill.workspace.intents[INTENT_INDEX].examples.push(example);
          }
        })
      }
    })
  }
}

const changeExample = (params) => {
  const SKILL = params?.skill;
  const SKILL_WORKSPACE = SKILL?.workspace;
  const SKILL_INTENTS = SKILL_WORKSPACE?.intents;
  const CHANGE_REQUEST_INTENTS = params?.intents;

  if (
    !lodash.isEmpty(CHANGE_REQUEST_INTENTS)
  ) {
    CHANGE_REQUEST_INTENTS.forEach(intent => {
      const EXISTING_EXAMPLES = intent?.existingExamples;
      const INTENT_NAME = intent?.intentName;

      if (
        !lodash.isEmpty(EXISTING_EXAMPLES) &&
        !lodash.isEmpty(SKILL_INTENTS)
      ) {
        const INTENT_INDEX = SKILL_INTENTS.findIndex(intent => intent.intent === INTENT_NAME);
        const INTENT_OBJECT = SKILL_INTENTS.filter(intent => intent.intent === INTENT_NAME);
        const INTENT_EXAMPLES = INTENT_OBJECT?.[0]?.examples;
        EXISTING_EXAMPLES?.forEach(existingExample => {
          INTENT_EXAMPLES?.forEach((intentExample, exampleIndex) => {
            if (
              existingExample?.text === intentExample?.text &&
              !lodash.isEmpty(existingExample?.newText)
            ) {
              params.skill.workspace.intents[INTENT_INDEX].examples[exampleIndex].text = existingExample?.newText;
            }
          })
        })
      }
    })
  }
}

export const formatIntents = (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: IFormatIntentsParamsV1,
) => {
  deleteIntentExamples(params);
  addIntentExamples(params);
  changeExample(params);
  return params.skill;
}
