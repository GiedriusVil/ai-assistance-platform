/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-users-find-many-lite-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindUsersLiteByQuery,
  IResponseV1FindUsersLiteByQuery,
} from '@ibm-aiap/aiap--types-domain-app';

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
  DatasourceAppV1Mongo,
} from '../..';

export const findManyLiteByQuery = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindUsersLiteByQuery,
): Promise<IResponseV1FindUsersLiteByQuery> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let pipeline;
  try {
    pipeline = aggregateQuery(params?.query);

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(
        context,
        {
          collection: datasource._collections.users,
          pipeline: pipeline,
        }
      );

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const USERS = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(USERS.length, ['total'], RESULT);

    const RET_VAL = {
      items: formatResponse(USERS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, pipeline });
    logger.error(findManyLiteByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
