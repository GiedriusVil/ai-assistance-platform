/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-service-tests-find-incorrect-intents-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
  IQueryPaginationV1,
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

export const findIncorrectIntentsByQuery = async (
  context: IContextV1,
  params: {
    query: {
      filter: {
        id: any,
      },
      sort: IQuerySortV1,
      pagination: IQueryPaginationV1,
    },
  },
) => {
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiServiceTests.findIncorrectIntentsByQuery(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findIncorrectIntentsByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
