/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-adapter-provider-adapter-watson-language-translator-v3-create-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { getWatsonLanguageTranslatorByAiTranslationService } from '@ibm-aiap/aiap-watson-language-translator-provider';
import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';
import { getModelStatus } from '../../utils';
import { deleteOne } from './delete-one';

import { IContextV1, IAiTranslationModelExampleV1, IAiTranslationModelExternalWLTV1 } from '@ibm-aiap/aiap--types-server';
import { ICreateOneParamsV1 } from '../types/params';


const transformExamples = (
  sourceLang: string,
  targetLang: string,
  aiTranslationModelExamples: Array<IAiTranslationModelExampleV1>,
) => {
  const RET_VAL = {
    sentences: []
  };

  RET_VAL.sentences = aiTranslationModelExamples.map((example) => {
    const SOURCE_EXAMPLE = {
      language: sourceLang,
      sentence: example.source
    };
    const TARGET_EXAMPLE = {
      language: targetLang,
      sentence: example.target
    };

    return [
      SOURCE_EXAMPLE,
      TARGET_EXAMPLE
    ];
  });

  return RET_VAL;
};

const transformWatsonLanguageTranslatorResponse = (response: any) => {
  const RET_VAL: any = {};

  const MODEL_DATA: IAiTranslationModelExternalWLTV1 = response?.result;

  RET_VAL.status = getModelStatus(MODEL_DATA);
  RET_VAL.external = response?.result;

  return RET_VAL;
};

const createOne = async (
  context: IContextV1,
  params: ICreateOneParamsV1,
) => {
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_MODEL = params?.aiTranslationModel;
  const AI_TRANSLATION_MODEL_EXAMPLES = params?.aiTranslationModelExamples;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = 'Missing required params.aiTranslationService parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_MODEL)) {
      const MESSAGE = 'Missing required params.aiTranslationModel parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_MODEL_EXAMPLES)) {
      const MESSAGE = 'Missing required params.aiTranslationModelExamples parameter';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const EXTERNAL_MODEL_ID = AI_TRANSLATION_MODEL?.external?.latest?.model_id;

    if (!lodash.isEmpty(EXTERNAL_MODEL_ID)) {
      await deleteOne(context, {
        aiTranslationService: AI_TRANSLATION_SERVICE,
        aiTranslationModel: AI_TRANSLATION_MODEL,
      });
    }

    const SOURCE = AI_TRANSLATION_MODEL.source;
    const TARGET = AI_TRANSLATION_MODEL.target;
    const TYPE = AI_TRANSLATION_MODEL.type;

    const BASE_MODEL_ID = `${SOURCE}-${TARGET}`;

    const PARAMS = {
      baseModelId: BASE_MODEL_ID,
      type: TYPE,
      examples: transformExamples(SOURCE, TARGET, AI_TRANSLATION_MODEL_EXAMPLES),
    };

    const WATSON_LANGUAGE_TRANSLATOR = getWatsonLanguageTranslatorByAiTranslationService(AI_TRANSLATION_SERVICE);

    const RESPONSE = await WATSON_LANGUAGE_TRANSLATOR.models.createModel(context, PARAMS);

    const RET_VAL = transformWatsonLanguageTranslatorResponse(RESPONSE);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('createOne', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  createOne,
};
