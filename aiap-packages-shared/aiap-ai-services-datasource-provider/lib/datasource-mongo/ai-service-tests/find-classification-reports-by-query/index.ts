/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-datasource-provider-datasource-mongo-ai-service-tests-find-classification-report-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IFindAiServiceTestClassificationReportsByQueryParamsV1,
  IFindAiServiceTestClassificationReportsByQueryResponseV1,
} from '../../../types';

import {
  AiServicesDatasourceMongoV1,
} from '../..';

import {
  aggregateQuery,
} from './aggregate-query';

export const findClassificationReportsByQuery = async (
  datasource: AiServicesDatasourceMongoV1,
  context: IContextV1,
  params: IFindAiServiceTestClassificationReportsByQueryParamsV1,
): Promise<IFindAiServiceTestClassificationReportsByQueryResponseV1> => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.aiServiceTests;

  let pipeline;
  try {
    pipeline = aggregateQuery(context, params?.query);

    const MONGO_CLIENT = await datasource._getMongoClient();

    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline,
      });

    const RESULT = ramda.pathOr({}, [0, 'reports'], RESPONSE);
    const TOTAL = ramda.pathOr({}, [0, 'total'], RESPONSE);
    const RET_VAL = {
      items: RESULT,
      total: ramda.pathOr(RESULT.length, [0, 'count'], TOTAL)
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findClassificationReportsByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

