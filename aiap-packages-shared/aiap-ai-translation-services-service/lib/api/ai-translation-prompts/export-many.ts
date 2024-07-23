/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-translation-services-service-ai-translation-prompts-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  IAiTranslationPromptV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationPromptsFindManyByQueryParamsV1
} from '../../types';

import {
  getDatasourceByContext
} from './../utils';


const exportMany = async (
  context: IContextV1,
  params: IAiTranslationPromptsFindManyByQueryParamsV1
): Promise<Array<IAiTranslationPromptV1>>  => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESULT = await DATASOURCE.aiTranslationPrompts.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  exportMany,
}
