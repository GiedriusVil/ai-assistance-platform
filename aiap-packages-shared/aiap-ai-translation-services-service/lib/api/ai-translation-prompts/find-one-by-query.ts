/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-prompts-find-one-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

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
  IAiTranslationPromptsFindOneByQueryParamsV1,
  IAiTranslationPromptsFindOneByQueryResponseV1,
} from '../../types';

import {
  getDatasourceByContext
} from '../utils';


const findOneByQuery = async (
  context: IContextV1,
  params: IAiTranslationPromptsFindOneByQueryParamsV1
): Promise<IAiTranslationPromptsFindOneByQueryResponseV1> => {
  const OPTIONS = params?.options;
  const AI_TRANSLATION_SERVICE_ID = params?.filter?.aiTranslationServiceId;
  
  let retVal;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiTranslationPrompts.findOneByQuery(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  findOneByQuery,
}
