/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-translate-by-service-model-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getRegistry
} from '@ibm-aiap/aiap-ai-translation-service-adapter-provider';

import {
  IAiTranslationModelV1,
  IAiTranslationServiceV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelsTranslateTextByServiceModelIdParamsV1,
  IAiTranslationModelsTranslateTextByServiceModelIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const translateTextByServiceModelId = async (
  context: IContextV1,
  params: IAiTranslationModelsTranslateTextByServiceModelIdParamsV1
): Promise<IAiTranslationModelsTranslateTextByServiceModelIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
  const AI_TRANSLATION_MODEL_ID = params?.aiTranslationModelId;
  const TEXT = params?.text;
  try {
    if (lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)) {
      const MESSAGE = `Missing params.aiTranslationServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_MODEL_ID)) {
      const MESSAGE = `Missing params.aiTranslationModelId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(TEXT)) {
      const MESSAGE = `Missing params.text parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [
      DATASOURCE.aiTranslationServices.findOneById(context, { id: AI_TRANSLATION_SERVICE_ID }),
      DATASOURCE.aiTranslationModels.findOneById(context, { id: AI_TRANSLATION_MODEL_ID }),
    ];

    const DATA = await Promise.all(PROMISES);
    const AI_TRANSLATION_SERVICE = DATA[0] as IAiTranslationServiceV1;
    const AI_TRANSLATION_MODEL = DATA[1] as IAiTranslationModelV1;

    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = `Unable to find AI_TRANSLATION_SERVICE with Id: ${AI_TRANSLATION_SERVICE_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(AI_TRANSLATION_MODEL)) {
      const MESSAGE = `Unable to find AI_TRANSLATION_SERVICE with Id: ${AI_TRANSLATION_MODEL_ID}!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const aiTranslationServiceAdapter = getRegistry()[AI_TRANSLATION_SERVICE?.type];

    if (!lodash.isObject(aiTranslationServiceAdapter)) {
      const MESSAGE = `Unsupported aiTranslationServiceAdapter type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const PARAMS = {
      aiTranslationService: AI_TRANSLATION_SERVICE,
      aiTranslationModel: AI_TRANSLATION_MODEL,
      text: TEXT
    };

    const RET_VAL = await aiTranslationServiceAdapter.translation.translateText(context, PARAMS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, AI_TRANSLATION_SERVICE_ID, AI_TRANSLATION_MODEL_ID });
    logger.error(translateTextByServiceModelId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  translateTextByServiceModelId,
};
