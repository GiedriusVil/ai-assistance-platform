/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-service-tests-find-incorrect-intents-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes'

import {
  aiServiceTestsService,
} from '@ibm-aiap/aiap-ai-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';


export const findIncorrectIntentsById = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  let result;
  try {
    const DEFAULT_QUERY = constructDefaultFindManyQueryFromRequest(request);

    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = {
      query: {
        filter: {
          id: request?.params?.id,
          ...DEFAULT_QUERY
        },
        sort: DEFAULT_QUERY?.sort,
        pagination: DEFAULT_QUERY?.pagination,
      }
    };
    result = await aiServiceTestsService.findIncorrectIntentsByQuery(CONTEXT, PARAMS);


  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
