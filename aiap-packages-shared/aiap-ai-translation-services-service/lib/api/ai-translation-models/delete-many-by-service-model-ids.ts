/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-delete-many-by-service-model-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import { 
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION,
  IAiTranslationModelV1,
  IAiTranslationServiceV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getRegistry
} from '@ibm-aiap/aiap-ai-translation-service-adapter-provider';

import {
  aiTranslationModelsChangesService
} from '..';

import {
  IAiTranslationModelsDeleteManyByServiceModelIdsParamsV1,
  IAiTranslationModelsDeleteManyByServiceModelIdsResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const deleteManyByServiceModelIds = async (
  context: IContextV1,
  params: IAiTranslationModelsDeleteManyByServiceModelIdsParamsV1
): Promise<IAiTranslationModelsDeleteManyByServiceModelIdsResponseV1> => {
  const AI_TRANSLATION_SERVICE_ID = params?.aiTranslationServiceId;
  try {
    const DATASOURCE = getDatasourceByContext(context);

    if (lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)) {
      const MESSAGE = `Missing params.aiTranslationServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PROMISES: Array<Promise<IAiTranslationServiceV1 | IAiTranslationModelV1>> = [
      DATASOURCE.aiTranslationServices.findOneById(context, { id: AI_TRANSLATION_SERVICE_ID }),
    ];

    const IDS = params?.ids;

    if (lodash.isEmpty(IDS)) {
      const MESSAGE = `Missing params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    IDS.forEach((id) => {
      PROMISES.push(DATASOURCE.aiTranslationModels.findOneById(context, { id }));
    });

    const DATA = await Promise.all(PROMISES);

    const AI_TRANSLATION_SERVICE = DATA[0];
    const AI_TRANSLATION_MODELS = DATA.slice(1);

    const AI_TRANSLATION_SERVICE_ADAPTER = getRegistry()[AI_TRANSLATION_SERVICE?.type];

    if (!lodash.isObject(AI_TRANSLATION_SERVICE_ADAPTER)) {
      const MESSAGE = `Unsupported AI_TRANSLATION_SERVICE_ADAPTER type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }

    await AI_TRANSLATION_SERVICE_ADAPTER.models.deleteMany(context, {
      aiTranslationService: AI_TRANSLATION_SERVICE as IAiTranslationServiceV1,
      aiTranslationModels: AI_TRANSLATION_MODELS as Array<IAiTranslationModelV1>,
    });

    await Promise.all([
      DATASOURCE.aiTranslationModelExamples.deleteManyByIds(context, { modelIds: IDS }),
      DATASOURCE.aiTranslationModels.deleteManyByIds(context, params),
    ]);

    const CHANGES_PROMISES = IDS.map((id) => {
      const VALUE = {
        id: id,
      };
      appendAuditInfo(context, VALUE);
      const CHANGES_SERVICE_PARAMS = {
        value: VALUE,
        action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
      };
      return aiTranslationModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);
    });

    await Promise.all(CHANGES_PROMISES);

    const RET_VAL = {
      status: 'Success',
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByServiceModelIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByServiceModelIds,
};
