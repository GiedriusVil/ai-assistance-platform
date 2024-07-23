/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-delete-many-by-service-id';
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
  IAiTranslationModelsDeleteManyByServiceIdParamsV1,
  IAiTranslationModelsDeleteManyByServiceIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const deleteManyByServiceId = async (
  context: IContextV1,
  params: IAiTranslationModelsDeleteManyByServiceIdParamsV1
): Promise<IAiTranslationModelsDeleteManyByServiceIdResponseV1> => {
  const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
  
  try {
    const DATASOURCE = getDatasourceByContext(context);

    if (lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)) {
      const MESSAGE = `Missing params.aiTranslationServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const QUERY = {
      filter: {
        aiTranslationServiceId: AI_TRANSLATION_SERVICE_ID,
      },
      pagination: {
        page: 1,
        size: 9999
      },
      sort: {
        field: 'id',
        direction: 'desc'
      }
    };

    const DATA = await Promise.all([
      DATASOURCE.aiTranslationServices.findOneById(context, { id: AI_TRANSLATION_SERVICE_ID }),
      DATASOURCE.aiTranslationModels.findManyByQuery(context, { ...QUERY })
    ]);

    const AI_TRANSLATION_SERVICE = DATA[0];
    const AI_TRANSLATION_MODELS_DATA = DATA[1];

    if (AI_TRANSLATION_MODELS_DATA.total !== 0) {
      const AI_TRANSLATION_SERVICE_ADAPTER = getRegistry()[AI_TRANSLATION_SERVICE?.type];

      if (!lodash.isObject(AI_TRANSLATION_SERVICE_ADAPTER)) {
        const MESSAGE = `Unsupported AI_TRANSLATION_SERVICE_ADAPTER type!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }

      
      await AI_TRANSLATION_SERVICE_ADAPTER.models.deleteMany(context, {
        aiTranslationService: AI_TRANSLATION_SERVICE,
        aiTranslationModels: AI_TRANSLATION_MODELS_DATA.items
      });
      
    }

    
    await Promise.all([
      DATASOURCE.aiTranslationModelExamples.deleteManyByIds(context, { ids: [AI_TRANSLATION_SERVICE_ID] }),
      DATASOURCE.aiTranslationModels.deleteManyByIds(context, { ids: [AI_TRANSLATION_SERVICE_ID] }),
    ]);

    const RET_VAL = {
      status: 'SUCCEESS',
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByServiceId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByServiceId,
};
