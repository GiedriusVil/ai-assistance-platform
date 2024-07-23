/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-services-change-request-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  appendContextToError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  aiServicesChangeRequestService,
} from '@ibm-aiap/aiap-ai-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const saveOne = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];

  let context;
  let params;

  let result;
  try {
    context = constructActionContextFromRequest(request);
    const REQUEST_BODY_VALUE = request?.body?.value;

    if (
      lodash.isEmpty(REQUEST_BODY_VALUE)
    ) {
      const MESSAGE = `Missing required request.body.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    params = {
      value: REQUEST_BODY_VALUE,
    };
    result = await aiServicesChangeRequestService.saveOne(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendContextToError(ACA_ERROR, context);
    appendDataToError(ACA_ERROR, { params });
    ERRORS.push(ACA_ERROR);
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(saveOne.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
