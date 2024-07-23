/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-translate-text';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getWatsonLanguageTranslatorByAiTranslationService } from '@ibm-aiap/aiap-watson-language-translator-provider';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';
import { AI_TRANSLATION_MODEL_STATUS  } from '../../utils';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { ITranslateTextParamsV1 } from '../types/params';

const translateText = async (
  context: IContextV1,
  params: ITranslateTextParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_MODEL = params?.aiTranslationModel;
  const SOURCE = params?.source;
  const TARGET = params?.target;
  const TEXT = params?.text;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = 'Missing required params.aiTranslationService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_MODEL) && lodash.isEmpty(TARGET)) {
      const MESSAGE = 'Both params.aiTranslationModel and params.target parameters cannot be empty!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    let externalModelId;

    if (!lodash.isEmpty(AI_TRANSLATION_MODEL)) {

      if (AI_TRANSLATION_MODEL.status !== AI_TRANSLATION_MODEL_STATUS.AVAILABLE) {
        const MESSAGE = `AI TRANSLATION MODEL is not in AVAILABLE status! Status: ${AI_TRANSLATION_MODEL.status}!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
  
      externalModelId = AI_TRANSLATION_MODEL?.external?.latest?.model_id;
  
      if (lodash.isEmpty(externalModelId)) {
        const MESSAGE = `AI TRANSLATION MODEL doesn't have external id! External id: ${externalModelId}!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
    }

    const WATSON_LANGUAGE_TRANSLATOR = getWatsonLanguageTranslatorByAiTranslationService(AI_TRANSLATION_SERVICE);

    const PARAMS = {
      text: TEXT,
      modelId: externalModelId,
      source: SOURCE,
      target: TARGET,
    };

    const RESPONSE = await WATSON_LANGUAGE_TRANSLATOR.translation.translateText(context, PARAMS);

    const TRANSLATION = RESPONSE?.translations[0]?.translation;

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
