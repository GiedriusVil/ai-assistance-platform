/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getRegistry
} from '@ibm-aiap/aiap-ai-translation-service-adapter-provider';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelsFindManyByQueryParamsV1,
  IAiTranslationModelsFindManyByQueryResponseV1,
  IAiTranslationServicesFindOneByIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const findManyByQuery = async (
  context: IContextV1,
  params: IAiTranslationModelsFindManyByQueryParamsV1
): Promise<IAiTranslationModelsFindManyByQueryResponseV1> => {
  const AI_TRANSLATION_SERVICE_ID = params?.filter?.aiTranslationServiceId;

  try {
    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [
      DATASOURCE.aiTranslationServices.findOneById(context, { id: AI_TRANSLATION_SERVICE_ID }),
      DATASOURCE.aiTranslationModels.findManyByQuery(context, params)
    ];

    const DATA = await Promise.all(PROMISES);

    const AI_TRANSLATION_SERVICE = DATA[0] as IAiTranslationServicesFindOneByIdResponseV1;
    const AI_TRANSLATION_MODELS_DATA = DATA[1] as IAiTranslationModelsFindManyByQueryResponseV1;

    if (lodash.isEmpty(AI_TRANSLATION_SERVICE)) {
      const MESSAGE = `Unable to find AI_TRANSLATION_SERVICE with ID: ${AI_TRANSLATION_SERVICE_ID}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    if (AI_TRANSLATION_MODELS_DATA.total === 0) {
      return AI_TRANSLATION_MODELS_DATA;
    }

    const AI_TRANSLATION_SERVICE_ADAPTER = getRegistry()[AI_TRANSLATION_SERVICE?.type];

    if (!lodash.isObject(AI_TRANSLATION_SERVICE_ADAPTER)) {
      const MESSAGE = `Unsupported AI_TRANSLATION_SERVICE_ADAPTER type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    const PARAMS = {
      aiTranslationService: AI_TRANSLATION_SERVICE,
      aiTranslationModels: AI_TRANSLATION_MODELS_DATA.items,
    };

    const UPDATED_AI_TRANSLATION_MODELS = await AI_TRANSLATION_SERVICE_ADAPTER.models.getMany(context, PARAMS);

    const UPDATE_MODEL_PROMISES = UPDATED_AI_TRANSLATION_MODELS.map((aiTranslationModel) => {
      return DATASOURCE.aiTranslationModels.saveOne(context, { value: aiTranslationModel });
    });

    const SAVED_AI_TRANSLATION_MODELS = await Promise.all(UPDATE_MODEL_PROMISES);

    const RET_VAL = {
      items: SAVED_AI_TRANSLATION_MODELS,
      total: AI_TRANSLATION_MODELS_DATA.total
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findManyByQuery,
}
