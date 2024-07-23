/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-identify-language-by-text';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getWatsonLanguageTranslatorByAiTranslationService } from '@ibm-aiap/aiap-watson-language-translator-provider';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IIdentifyLanguageByTextParamsV1 } from '../types/params';

const identifyLanguageByText = async (
  context: IContextV1,
  params: IIdentifyLanguageByTextParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const TEXT = params?.text;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = 'Missing required params.aiTranslationService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(TEXT)) {
      const MESSAGE = 'Missing required params.text parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const WATSON_LANGUAGE_TRANSLATOR = getWatsonLanguageTranslatorByAiTranslationService(AI_TRANSLATION_SERVICE);

    const PARAMS = {
      text: TEXT
    };

    const RESPONSE = await WATSON_LANGUAGE_TRANSLATOR.identification.identifyLanguageByText(context, PARAMS);

    const LANGUAGES = [];

    RESPONSE?.languages?.forEach((item) => {
      if (!lodash.isEmpty(item?.language) && lodash.isNumber(item?.confidence)) {
        LANGUAGES.push({
          language: item.language,
          confidence: item.confidence,
        });
      }
    });

    const RET_VAL = {
      languages: LANGUAGES,
      external: RESPONSE
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(identifyLanguageByText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  identifyLanguageByText,
};
