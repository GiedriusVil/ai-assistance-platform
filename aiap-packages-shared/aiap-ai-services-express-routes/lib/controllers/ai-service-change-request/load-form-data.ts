/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-services-change-request-load-form-data';
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
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const loadFormData = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const REQUEST_BODY_VALUE = request?.body?.value;
  const AI_SERVICE_ID = REQUEST_BODY_VALUE?.aiService?.id;
  const AI_SKILL_ID = REQUEST_BODY_VALUE?.aiService?.aiSkill?.id;
  const AI_SKILL_INTENT_NAME = REQUEST_BODY_VALUE?.intentName;

  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(AI_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiService.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SKILL_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiService.aiSkill.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_SKILL_INTENT_NAME)
    ) {
      const MESSAGE = `Missing required request.body.intentName parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      value: REQUEST_BODY_VALUE
    }
    result = await aiServicesChangeRequestService.loadFormData(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_SERVICE_ID, AI_SKILL_INTENT_NAME, AI_SKILL_ID });
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
