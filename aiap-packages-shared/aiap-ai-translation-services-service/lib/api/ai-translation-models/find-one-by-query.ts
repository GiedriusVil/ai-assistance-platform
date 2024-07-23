/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-find-one-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  getRegistry
} from '@ibm-aiap/aiap-ai-translation-service-adapter-provider';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelsFindOneByIdResponseV1,
  IAiTranslationModelsFindOneByQueryParamsV1,
  IAiTranslationModelsFindOneByQueryResponseV1,
  IAiTranslationServicesFindOneByIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const findOneByQuery = async (
  context: IContextV1,
  params: IAiTranslationModelsFindOneByQueryParamsV1
): Promise<IAiTranslationModelsFindOneByQueryResponseV1> => {
  const OPTIONS = params?.options;
  const AI_TRANSLATION_SERVICE_ID = params?.filter?.aiTranslationServiceId;
  
  let retVal;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required params.filter.aiTranslationServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);

    if (OPTIONS?.refreshStatus === true) {
      const AI_TRANSLATION_MODEL_ID = params?.filter?.aiTranslationModelId;

      if (
        lodash.isEmpty(AI_TRANSLATION_MODEL_ID)
      ) {
        const MESSAGE = `Missing required params.filter.aiTranslationServiceId parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      const PROMISES = [
        DATASOURCE.aiTranslationServices.findOneById(context, { id: AI_TRANSLATION_SERVICE_ID }),
        DATASOURCE.aiTranslationModels.findOneById(context, { id: AI_TRANSLATION_MODEL_ID })
      ];

      const DATA = await Promise.all(PROMISES);

      const AI_TRANSLATION_SERVICE = DATA[0] as IAiTranslationServicesFindOneByIdResponseV1;
      const AI_TRANSLATION_MODEL = DATA[1] as IAiTranslationModelsFindOneByIdResponseV1;

      const AI_TRANSLATION_SERVICE_ADAPTER = getRegistry()[AI_TRANSLATION_SERVICE?.type];

      if (!lodash.isObject(AI_TRANSLATION_SERVICE_ADAPTER)) {
        const MESSAGE = `Unsupported AI_TRANSLATION_SERVICE_ADAPTER type!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }

      const PARAMS = {
        aiTranslationService: AI_TRANSLATION_SERVICE,
        aiTranslationModel: AI_TRANSLATION_MODEL,
      };

      const UPDATED_AI_TRANSLATION_MODEL = await AI_TRANSLATION_SERVICE_ADAPTER.models.getOne(context, PARAMS);

      const SAVED_AI_TRANSLATION_MODEL = await DATASOURCE.aiTranslationModels.saveOne(context, { value: UPDATED_AI_TRANSLATION_MODEL });

      retVal = SAVED_AI_TRANSLATION_MODEL;
    } else {
      const SOURCE = params?.filter?.source;
      const TARGET = params?.filter?.target;

      if (
        lodash.isEmpty(SOURCE)
      ) {
        const MESSAGE = `Missing required params.filter.source parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(TARGET)
      ) {
        const MESSAGE = `Missing required params.filter.target parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }

      retVal = await DATASOURCE.aiTranslationModels.findOneByQuery(context, params);
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  findOneByQuery,
}
