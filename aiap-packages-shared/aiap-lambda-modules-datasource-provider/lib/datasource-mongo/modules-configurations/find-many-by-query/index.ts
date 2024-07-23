/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo-configurations-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import { 
  formatIntoAcaError, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import { aggregateQuery } from './aggregate-query';
import { formatResponse } from './format-response';

import {
  LambdaModulesDatasourceMongoV1,
} from '../../';

import {
  IFindLambdaModulesConfigurationsByQueryParamsV1,
  IFindLambdaModulesConfigurationsByQueryResponseV1,
} from '../../../types';

const findManyByQuery = async (
  datasource: LambdaModulesDatasourceMongoV1, 
  context: IContextV1, 
  params: IFindLambdaModulesConfigurationsByQueryParamsV1): Promise<IFindLambdaModulesConfigurationsByQueryResponseV1> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.modulesConfigurations;

  let query;
  try {
    query = aggregateQuery(context, params);
    const ACA_MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
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
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${findManyByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  findManyByQuery,
};
