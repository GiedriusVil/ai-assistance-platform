/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-get-get-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getWatsonLanguageTranslatorByAiTranslationService } from '@ibm-aiap/aiap-watson-language-translator-provider';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';
import { getModelStatus } from '../../utils';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IGetOneParamsV1 } from '../types/params';

const getOne = async (
  context: IContextV1,
  params: IGetOneParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_MODEL = params?.aiTranslationModel;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = 'Missing required params.aiTranslationService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_MODEL)) {
      const MESSAGE = 'Missing required params.aiTranslationModel parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const EXTERNAL_MODEL_ID = AI_TRANSLATION_MODEL?.external?.latest?.model_id;

    if (lodash.isEmpty(EXTERNAL_MODEL_ID)) {
      logger.info('External model id is empty. Model not yet trained', { 
        aiTranslationServiceId: AI_TRANSLATION_SERVICE.id,
        aiTranslationModelId: AI_TRANSLATION_MODEL.id,
      });
      return AI_TRANSLATION_MODEL;
    }

    const WATSON_LANGUAGE_TRANSLATOR = getWatsonLanguageTranslatorByAiTranslationService(AI_TRANSLATION_SERVICE);

    const RESPONSE = await WATSON_LANGUAGE_TRANSLATOR.models.getModel(context, { modelId: EXTERNAL_MODEL_ID });

    if (lodash.isEmpty(RESPONSE?.result)) {
      const MESSAGE = 'Missing required WatsonLanguageTranslatorV3.getModel response';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    AI_TRANSLATION_MODEL.status = getModelStatus(RESPONSE?.result);
    AI_TRANSLATION_MODEL.external.latest = RESPONSE?.result;

    return AI_TRANSLATION_MODEL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  getOne,
};
