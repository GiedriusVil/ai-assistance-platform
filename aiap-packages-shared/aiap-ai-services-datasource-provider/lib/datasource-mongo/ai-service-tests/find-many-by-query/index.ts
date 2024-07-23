/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-service-tests-find-many-by-query';
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
  aggregateQuery,
} from './aggregate-query';

import {
  formatResponse,
} from './format-response';

import {
  IFindAiServiceTestsByQueryParamsV1,
  IFindAiServiceTestsByQueryResponseV1,
} from '../../../types';

import {
  AiServicesDatasourceMongoV1,
} from '../..';

export const findManyByQuery = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiServiceTestsByQueryParamsV1,
): Promise<IFindAiServiceTestsByQueryResponseV1> => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServiceTests;

  let pipeline;
  try {
    pipeline = aggregateQuery(context, params?.query);

    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const USERS = ramda.pathOr([], ['items'], RESULT);

    const TOTAL = ramda.pathOr({}, ['total'], RESULT);
    const RET_VAL = {
      items: formatResponse(USERS),
      total: ramda.pathOr(USERS.length, [0, 'count'], TOTAL)
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
