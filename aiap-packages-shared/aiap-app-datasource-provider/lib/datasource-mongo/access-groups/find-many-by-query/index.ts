/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-access-groups-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindAccessGroupsByQuery,
  IResponseV1FindAccessGroupsByQuery,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  DatasourceAppV1Mongo,
} from '../..';

import {
  aggregateQuery,
} from './aggregate-query';

import {
  formatResponse,
} from './format-response';

export const findManyByQuery = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindAccessGroupsByQuery,
): Promise<IResponseV1FindAccessGroupsByQuery> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let pipeline;
  try {
    pipeline = aggregateQuery(params?.query);

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: datasource._collections.accessGroups,
        pipeline: pipeline,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const ACCESS_GROUPS = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(ACCESS_GROUPS.length, ['total'], RESULT);

    const RET_VAL = {
      items: formatResponse(ACCESS_GROUPS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
