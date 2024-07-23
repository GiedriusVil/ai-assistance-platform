/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-delete-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getWatsonLanguageTranslatorByAiTranslationService } from '@ibm-aiap/aiap-watson-language-translator-provider';
import { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } from '@ibm-aca/aca-utils-errors';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IDeleteOneParamsV1 } from '../types/params';

const deleteOne = async (
  context: IContextV1,
  params: IDeleteOneParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_MODEL = params?.aiTranslationModel;

  const RET_VAL = {
    status: 'OK'
  };
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
      return RET_VAL;
    }

    const WATSON_LANGUAGE_TRANSLATOR = getWatsonLanguageTranslatorByAiTranslationService(AI_TRANSLATION_SERVICE);

    const RESPONSE = await WATSON_LANGUAGE_TRANSLATOR.models.deleteModel(context, { modelId: EXTERNAL_MODEL_ID });

    RET_VAL.status = RESPONSE?.result?.status;

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    if (error?.external?.code === 404) {
      logger.error(`${deleteOne.name} Model not found`, { ACA_ERROR });
      return RET_VAL;
    }
    if (error?.external?.code === 400) {
      logger.error(`${deleteOne.name} Bad request`, { ACA_ERROR });
      return RET_VAL;
    }
    logger.error(deleteOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteOne,
};
