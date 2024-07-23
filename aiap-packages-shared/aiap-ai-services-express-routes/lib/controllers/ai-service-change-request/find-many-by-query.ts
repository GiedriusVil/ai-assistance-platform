/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-services-change-request-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  aiServicesChangeRequestService,
} from '@ibm-aiap/aiap-ai-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

export const findManyByQuery = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = CONTEXT?.user?.id;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(request?.body?.query)
    ) {
      const MESSAGE = `Missing required request.body.query paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      query: request?.body?.query,
    };
    result = await aiServicesChangeRequestService.findManyByQuery(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
