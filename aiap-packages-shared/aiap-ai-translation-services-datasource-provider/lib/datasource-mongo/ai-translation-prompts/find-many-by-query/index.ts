/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-mongo-ai-translation-prompts-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import { 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';


import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationPromptsFindManyByQueryParamsV1,
  IAiTranslationPromptsFindManyByQueryResponseV1
} from '../../../types';

import {
  AiTranslationServicesDatasourceMongoV1
} from '../..';

import { 
  aggregateQuery 
} from './aggregate-query';

import { 
  formatResponse 
} from'./format-response';

const findManyByQuery = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationPromptsFindManyByQueryParamsV1,
): Promise<IAiTranslationPromptsFindManyByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiTranslationPrompts;

  let query;
  try {
    query = aggregateQuery(params);

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const AI_TRANSLATION_PROMPTS = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(AI_TRANSLATION_PROMPTS.length, ['total'], RESULT);

    const RET_VAL: IAiTranslationPromptsFindManyByQueryResponseV1 = {
      items: formatResponse(AI_TRANSLATION_PROMPTS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID: CONTEXT_USER_ID, query });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findManyByQuery
}
