/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-express-routes-controller-engagements-delete-many-by-ids';
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
  engagementsService
} from '@ibm-aiap/aiap-engagements-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const deleteManyByIds = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const REQUEST_BODY_IDS = request?.body?.ids;

  const ERRORS = [];
  let params;
  let result;
  try {
    if (
      lodash.isEmpty(REQUEST_BODY_IDS)
    ) {
      const MESSAGE = `Missing required request?.body?.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    params = { ids: REQUEST_BODY_IDS }
    result = await engagementsService.deleteManyByIds(CONTEXT, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendContextToError(ACA_ERROR, CONTEXT);
    appendDataToError(ACA_ERROR, { params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(deleteManyByIds.name, ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
};
