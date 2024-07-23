/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-models-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationModelV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelsFindManyByQueryParamsV1
} from '../../types';

import {
  getDatasourceByContext
} from './../utils';

import {
  attachExamplesToModels
} from '../utils';


const exportMany = async (
  context: IContextV1,
  params: IAiTranslationModelsFindManyByQueryParamsV1
): Promise<Array<IAiTranslationModelV1>> => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESULT = await DATASOURCE.aiTranslationModels.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    const ATTACH_PARAMS = {
      exportManyParams: params,
      models: RET_VAL,
    };
    await attachExamplesToModels(context, ATTACH_PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  attachExamplesToModels,
  exportMany,
}
