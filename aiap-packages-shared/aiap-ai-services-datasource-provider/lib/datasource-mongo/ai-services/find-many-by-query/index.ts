/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-services-find-many-by-query';
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
  IFindAiServicesByQueryParamsV1,
  IFindAiServicesByQueryResponseV1,
} from '../../../types/params/ai-services';

import {
  AiServicesDatasourceMongoV1,
} from '../..';

import {
  aggregateQuery,
} from './aggregate-query';

import {
  formatResponse,
} from './format-response';

export const findManyByQuery = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiServicesByQueryParamsV1,
): Promise<IFindAiServicesByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServices;

  let pipeline;
  try {
    pipeline = aggregateQuery(context, params?.query);

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(context,
        {
          collection: COLLECTION,
          pipeline: pipeline,
        });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const AI_SERVICES = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(AI_SERVICES.length, ['total'], RESULT);

    const RET_VAL: IFindAiServicesByQueryResponseV1 = {
      items: formatResponse(datasource.configuration, AI_SERVICES),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, pipeline });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
