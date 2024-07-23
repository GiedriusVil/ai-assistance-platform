/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

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
  IAiTranslationPromptsFindManyByQueryParamsV1,
  IAiTranslationPromptsFindManyByQueryResponseV1,
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const findManyByQuery = async (
  context: IContextV1,
  params: IAiTranslationPromptsFindManyByQueryParamsV1
): Promise<IAiTranslationPromptsFindManyByQueryResponseV1> => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationPrompts.findManyByQuery(context, params);
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
