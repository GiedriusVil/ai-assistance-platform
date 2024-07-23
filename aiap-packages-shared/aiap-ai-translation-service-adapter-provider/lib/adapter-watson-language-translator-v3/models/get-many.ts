/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-get-get-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getWatsonLanguageTranslatorByAiTranslationService } from '@ibm-aiap/aiap-watson-language-translator-provider';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';
import { getModelStatus } from '../../utils';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IGetManyParamsV1 } from '../types/params';

const getMany = async (
  context: IContextV1,
  params: IGetManyParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_MODELS = params?.aiTranslationModels;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = 'Missing required params.aiTranslationService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (!lodash.isArray(AI_TRANSLATION_MODELS)) {
      const MESSAGE = 'Wrong type of params.aiTranslationModel parameter. Expected array';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const AI_TRANSLATION_MODELS_WITH_EXTERNAL_ID = AI_TRANSLATION_MODELS.filter((aiTranslationModel) => {
      return !lodash.isEmpty(aiTranslationModel?.external?.latest?.model_id);
    });

    // Don't call WLT if none of the models has external id
    if (AI_TRANSLATION_MODELS_WITH_EXTERNAL_ID.length === 0) {
      return AI_TRANSLATION_MODELS;
    }

    const WATSON_LANGUAGE_TRANSLATOR = getWatsonLanguageTranslatorByAiTranslationService(AI_TRANSLATION_SERVICE);

    const RESPONSE = await WATSON_LANGUAGE_TRANSLATOR.models.listModels(context, { onlyCustomModels: true });

    const MODELS = RESPONSE?.result?.models;

    if (lodash.isEmpty(MODELS) || !lodash.isArray(MODELS)) {
      const MESSAGE = 'Watson Language Translator list Models response is empty or not array!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    AI_TRANSLATION_MODELS.forEach((aiTranslationModel) => {
      if (aiTranslationModel?.external?.latest?.model_id) {
        const DATA = MODELS.find(model => model.model_id === aiTranslationModel.external.latest.model_id);

        if (!lodash.isEmpty(DATA)) {
          aiTranslationModel.status = getModelStatus(DATA);
          aiTranslationModel.external.latest = DATA;
        }
      }
    });

    return AI_TRANSLATION_MODELS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  getMany,
};
