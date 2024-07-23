/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-model-examples-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import { 
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  CHANGE_ACTION, IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationModelExamplesDeleteManyByIdsParamsV1,
  IAiTranslationModelExamplesDeleteManyByIdsResponseV1,
  IAiTranslationModelExamplesFindOneByIdResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';

import {
  aiTranslationModelsChangesService
} from '..';

import {
  findOneById
} from './find-one-by-id';


const deleteManyByIds = async (
  context: IContextV1,
  params: IAiTranslationModelExamplesDeleteManyByIdsParamsV1
): Promise<IAiTranslationModelExamplesDeleteManyByIdsResponseV1> => {
  try {
    const IDS = params?.ids;
    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const EXAMPLES_TO_DELETE_PROMISES:
      Array<Promise<IAiTranslationModelExamplesFindOneByIdResponseV1>>
      = IDS.map((id) => findOneById(context, { id }));

    const EXAMPLES_TO_DELETE = await Promise.all(EXAMPLES_TO_DELETE_PROMISES);

    const CHANGES_PROMISES = EXAMPLES_TO_DELETE.map((example) => {
      const VALUE = {
        id: example.modelId,
        source: example.source,
        target: example.target,
        created: example.created,
        updated: example.updated,
      };
      appendAuditInfo(context, VALUE);
      const CHANGES_SERVICE_PARAMS = {
        value: VALUE,
        action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
        docType: 'AI TRANSLATION MODEL EXAMPLE',
      };
      return aiTranslationModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);
    });

    await Promise.all(CHANGES_PROMISES);
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationModelExamples.deleteManyByIds(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteManyByIds
}
