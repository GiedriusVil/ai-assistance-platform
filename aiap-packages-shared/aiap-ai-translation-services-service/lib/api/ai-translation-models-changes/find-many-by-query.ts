/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-changes-service-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelsChangesFindManyByQueryParamsV1,
  IAiTranslationModelsChangesFindManyByQueryResponseV1
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const findManyByQuery = async (
  context: IContextV1,
  params: IAiTranslationModelsChangesFindManyByQueryParamsV1
): Promise<IAiTranslationModelsChangesFindManyByQueryResponseV1> => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationModelsChanges.findManyByQuery(context, params);
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
