/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-users-changes-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindUserV1ChangesByQuery,
  IResponseV1FindUserV1ChangesByQuery,
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

export const findManyByQuery = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindUserV1ChangesByQuery,
): Promise<IResponseV1FindUserV1ChangesByQuery> => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLATION = { collation: { locale: 'en' } };

  let query;
  try {
    query = aggregateQuery(context, params?.query);

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: datasource._collections.usersChanges,
        pipeline: query,
        options: COLLATION,
      });


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
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, query });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
