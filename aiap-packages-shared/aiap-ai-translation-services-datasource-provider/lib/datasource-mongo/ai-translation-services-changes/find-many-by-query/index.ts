/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-translation-services-datasource-mongo-ai-translation-services-changes-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  AiTranslationServicesDatasourceMongoV1
} from '../..';

import {
  IAiTranslationServicesChangesFindManyByQueryParamsV1,
  IAiTranslationServicesChangesFindManyByQueryResponseV1
} from '../../../types';

import {
  aggregateQuery,
} from './aggregate-query';

import {
  formatResponse,
} from './format-response';

const findManyByQuery = async (
  datasource: AiTranslationServicesDatasourceMongoV1,
  context: IContextV1,
  params: IAiTranslationServicesChangesFindManyByQueryParamsV1,
): Promise<IAiTranslationServicesChangesFindManyByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiTranslationServicesChanges;

  let query;

  try {
    query = aggregateQuery(params);
    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
        options: {
          allowDiskUse: true, 
        }
      });
    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const ITEMS = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = RESULT?.total || ITEMS.length;
    const RET_VAL: IAiTranslationServicesChangesFindManyByQueryResponseV1 = {
      items: formatResponse(ITEMS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query })
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findManyByQuery,
}
