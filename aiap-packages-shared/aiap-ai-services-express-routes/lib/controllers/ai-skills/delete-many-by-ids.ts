/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-express-routes-ai-skills-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  aiSkillsService,
} from '@ibm-aiap/aiap-ai-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const deleteManyByIds = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = CONTEXT?.user?.id;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(request?.body?.ids)
    ) {
      const MESSAGE = `Missing required request.body.ids paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isArray(request?.body?.ids)
    ) {
      const MESSAGE = `Wrong type of request.body paramater! [Expected -> Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(request?.body?.aiServiceId)
    ) {
      const MESSAGE = `Missing required request.body.aiServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      ids: request?.body?.ids,
      aiServiceId: request?.body?.aiServiceId,
    };
    result = await aiSkillsService.deleteManyByIds(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERRROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERRROR, { CONTEXT_USER_ID });
    ERRORS.push(ACA_ERRROR);
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

