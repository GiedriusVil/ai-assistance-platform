/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watsonx-v1-translate-text';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getWatsonxByService } from '@ibm-aiap/aiap-watsonx-provider';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { IContextV1, IAiTranslationServiceExternalWatsonxV1 } from '@ibm-aiap/aiap--types-server';
import { ITranslateTextParamsV1 } from '../types/params';

const translateText = async (
  context: IContextV1,
  params: ITranslateTextParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_PROMPT = params?.aiTranslationPrompt;
  const PARAMETERS = params?.parameters;
  const INPUT = params?.input;

  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = 'Missing required params.aiTranslationService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_PROMPT) && lodash.isEmpty(PARAMETERS)) {
      const MESSAGE = 'Both params.aiTranslationPrompt and params.parameters cannot be empty!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const SERVICE_PARAMS = {
      id: AI_TRANSLATION_SERVICE?.id,
      external: AI_TRANSLATION_SERVICE?.external as IAiTranslationServiceExternalWatsonxV1,
    };
    const WATSONX = getWatsonxByService(SERVICE_PARAMS);

    const PARAMS = {
      aiTranslationPrompt: AI_TRANSLATION_PROMPT,
      parameters: PARAMETERS,
    } as ITranslateTextParamsV1;

    if (!lodash.isEmpty(INPUT)) {
      PARAMS.input = INPUT;
    }

    const RESPONSE = await WATSONX.translation.translateText(context, PARAMS);

    const TRANSLATION = RESPONSE?.results[0]?.generated_text;

    const RET_VAL = {
      translation: {
        text: TRANSLATION,
      },
      external: RESPONSE,
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(translateText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  translateText,
};
