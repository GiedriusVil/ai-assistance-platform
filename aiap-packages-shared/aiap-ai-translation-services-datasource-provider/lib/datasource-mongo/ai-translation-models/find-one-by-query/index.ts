/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-translation-services-datasource-mongo-ai-translation-models-find-one-by-query';
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
  IAiTranslationModelsFindOneByQueryParamsV1,
  IAiTranslationModelsFindOneByQueryResponseV1
} from '../../../types';

import {
  AiTranslationServicesDatasourceMongoV1
} from '../..';

import { 
  aggregateQuery 
} from './aggregate-query';

import {
  formatResponse 
} from './format-response';

const findOneByQuery = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationModelsFindOneByQueryParamsV1,
): Promise<IAiTranslationModelsFindOneByQueryResponseV1> => {
  const USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiTranslationModels;

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
    const AI_TRANSLATION_MODEL = ramda.pathOr({}, ['items', '0'], RESULT);

    const RET_VAL: IAiTranslationModelsFindOneByQueryResponseV1 = formatResponse(AI_TRANSLATION_MODEL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, query });
    logger.error(findOneByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findOneByQuery
}
