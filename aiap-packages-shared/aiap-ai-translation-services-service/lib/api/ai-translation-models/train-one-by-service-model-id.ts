/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-train-one';
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
  calcDiffByValue,
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION,
  IAiTranslationModelV1,
  IAiTranslationServiceV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelExamplesFindManyByQueryResponseV1,
  IAiTranslationModelsTrainOneByServiceModelIdParamsV1,
  IAiTranslationModelsTrainOneByServiceModelIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';

import {
  findOneById
} from './find-one-by-id';

import {
  aiTranslationModelsChangesService
} from '..';


const trainOneByServiceModelId = async (
  context: IContextV1, 
  params: IAiTranslationModelsTrainOneByServiceModelIdParamsV1
): Promise<IAiTranslationModelsTrainOneByServiceModelIdResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
  const AI_TRANSLATION_MODEL_ID = params?.aiTranslationModelId;
  try {
    const DATASOURCE = getDatasourceByContext(context);

    const AI_TRANSLATION_MODEL_EXAMPLES_PARAMS = {
      filter: {
        aiTranslationModelId: AI_TRANSLATION_MODEL_ID
      },
      pagination: { page: 1, size: 9999 },
      sort: { field: 'source', direction: 'asc' } 
    };

    const PROMISES = [
      DATASOURCE.aiTranslationServices.findOneById(context, { id: AI_TRANSLATION_SERVICE_ID }),
      DATASOURCE.aiTranslationModels.findOneById(context, { id: AI_TRANSLATION_MODEL_ID }),
      DATASOURCE.aiTranslationModelExamples.findManyByQuery(context, AI_TRANSLATION_MODEL_EXAMPLES_PARAMS)
    ];
    
    const DATA = await Promise.all(PROMISES);
    const AI_TRANSLATION_SERVICE = DATA[0] as IAiTranslationServiceV1;
    const AI_TRANSLATION_MODEL = DATA[1] as IAiTranslationModelV1;
    const AI_TRANSLATION_MODEL_EXAMPLES = DATA[2] as IAiTranslationModelExamplesFindManyByQueryResponseV1;

    const aiTranslationServiceAdapter = getRegistry()[AI_TRANSLATION_SERVICE?.type];

    if (!lodash.isObject(aiTranslationServiceAdapter)) {
      const MESSAGE = `Unsupported aiTranslationServiceAdapter type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const PARAMS = {
      aiTranslationService: AI_TRANSLATION_SERVICE,
      aiTranslationModel: AI_TRANSLATION_MODEL,
      aiTranslationModelExamples: AI_TRANSLATION_MODEL_EXAMPLES.items
    };

    const RESPONSE = await aiTranslationServiceAdapter.models.createOne(context, PARAMS);

    AI_TRANSLATION_MODEL.status = RESPONSE.status;
    AI_TRANSLATION_MODEL.external.latest = RESPONSE.external;

    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: {
        id: AI_TRANSLATION_MODEL_ID,
      },
    });

    const RET_VAL = await DATASOURCE.aiTranslationModels.saveOne(context, {
      value: AI_TRANSLATION_MODEL,
    });

    await aiTranslationModelsChangesService.saveOne(
      context,
      {
        value: RET_VAL,
        action: CHANGE_ACTION.TRAIN_ONE,
        docChanges: DIFFERENCES,
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, AI_TRANSLATION_SERVICE_ID, AI_TRANSLATION_MODEL_ID });
    logger.error(trainOneByServiceModelId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  trainOneByServiceModelId,
};
