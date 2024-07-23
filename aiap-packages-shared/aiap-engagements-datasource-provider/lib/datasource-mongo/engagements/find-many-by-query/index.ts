/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-mongo-engagements-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  aggregateQuery,
} from './aggregate-query';

import {
  formatResponse,
} from './format-response';

import {
  EngagementsDatasourceMongo
} from '../..';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFindEngagementsByQueryParamsV1,
  IFindEngagementsByQueryResponseV1
} from '../../../types';

export const findManyByQuery = async (
  datasource: EngagementsDatasourceMongo,
  context: IContextV1,
  params: IFindEngagementsByQueryParamsV1
): Promise<IFindEngagementsByQueryResponseV1> => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.engagements;

  let query;
  try {
    query = aggregateQuery(params);

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const ITEMS = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(ITEMS.length, ['total'], RESULT);

    const RET_VAL = {
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
