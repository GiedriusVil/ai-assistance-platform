/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-translate-text-by-prompt-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getRegistry,
} from '@ibm-aiap/aiap-ai-translation-service-adapter-provider';

import {
  IAiTranslationPromptV1,
  IAiTranslationServiceV1,
  IContextV1,
  IAiTranslationPromptExternalWatsonxV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationPromptsTranslateTextByPromptIdParamsV1,
  IAiTranslationPromptsTranslateTextByServicePromptIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const translateTextByPromptId = async (
  context: IContextV1,
  params: IAiTranslationPromptsTranslateTextByPromptIdParamsV1,
): Promise<IAiTranslationPromptsTranslateTextByServicePromptIdResponseV1> => {
  const USER_ID = context?.user?.id;
  const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
  const AI_TRANSLATION_PROMPT_ID = params?.aiTranslationPromptId;
  const TEXT = params?.text;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)) {
      const MESSAGE = `Missing params.aiTranslationServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_PROMPT_ID)) {
      const MESSAGE = `Missing params.aiTranslationPromptId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(TEXT)) {
      const MESSAGE = `Missing params.text parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [
      DATASOURCE.aiTranslationServices.findOneById(context, { id: AI_TRANSLATION_SERVICE_ID }),
      DATASOURCE.aiTranslationPrompts.findOneById(context, { id: AI_TRANSLATION_PROMPT_ID }),
    ];

    const DATA = await Promise.all(PROMISES);
    const AI_TRANSLATION_SERVICE = DATA[0] as IAiTranslationServiceV1;
    const AI_TRANSLATION_PROMPT = DATA[1] as IAiTranslationPromptV1;

    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = `Unable to find AI_TRANSLATION_SERVICE with Id: ${AI_TRANSLATION_SERVICE_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_PROMPT)) {
      const MESSAGE = `Unable to find AI_TRANSLATION_PROMPT with Id: ${AI_TRANSLATION_PROMPT_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const aiTranslationServiceAdapter = getRegistry()[AI_TRANSLATION_SERVICE?.type];

    if (!lodash.isObject(aiTranslationServiceAdapter)) {
      const MESSAGE = `Unsupported aiTranslationServiceAdapter type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const PARAMS = {
      aiTranslationService: AI_TRANSLATION_SERVICE,
      aiTranslationPrompt: AI_TRANSLATION_PROMPT,
      parameters: AI_TRANSLATION_PROMPT.external?.parameters,
      input: AI_TRANSLATION_PROMPT.external?.input,
    } as IAiTranslationPromptExternalWatsonxV1;

    const PROMPT_TYPES = {
      DEPLOYMENT: 'deployment',
      PROJECT: 'project',
    };

    switch (AI_TRANSLATION_PROMPT.type) {
      case PROMPT_TYPES.DEPLOYMENT:
        PARAMS.parameters = {
          prompt_variables: {
            lang: AI_TRANSLATION_PROMPT?.source,
            text: TEXT,
          }
        };
        break;
      case PROMPT_TYPES.PROJECT:
        PARAMS.input = PARAMS.input += TEXT;
        break;
    }

    const RET_VAL = await aiTranslationServiceAdapter.translation.translateText(context, PARAMS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_TRANSLATION_SERVICE_ID, AI_TRANSLATION_PROMPT_ID });
    logger.error(translateTextByPromptId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  translateTextByPromptId,
};
