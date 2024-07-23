/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-intents-create-example';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';


import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

// import {
//   aiIntentsService,
// } from '@ibm-aiap/aiap-ai-services-service';

export const createExample = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const SERVICE_ID = ramda.path(['params', 'serviceId'], request);
    const SKILL_ID = ramda.path(['params', 'skillId'], request);
    const INTENT_ID = ramda.path(['params', 'id'], request);
    const SKILL_NAME = ramda.path(['body', 'skillName'], request);
    const MESSAGE_ID = ramda.path(['body', 'messageId'], request);
    const FEEDBACK_ID = ramda.path(['body', 'feedbackId'], request);
    const ORIGINAL_INTENT_ID = ramda.path(['body', 'originalIntentId'], request);
    const TEXT = ramda.path(['body', 'text'], request);
    if (
      lodash.isEmpty(TEXT)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.text attribute!`
      }
      throw ACA_ERROR;
    }
    if (
      lodash.isEmpty(MESSAGE_ID)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `[${MODULE_ID}] Missing required request.body.messageId attribute!`
      }
      throw ACA_ERROR;
    }
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const CREATE_EXAMPLE_PARAMS = {
        serviceId: SERVICE_ID,
        skillId: SKILL_ID,
        skillName: SKILL_NAME,
        intentId: INTENT_ID,
        messageId: MESSAGE_ID,
        feedbackId: FEEDBACK_ID,
        originalIntentId: ORIGINAL_INTENT_ID,
        text: TEXT
      }
      logger.info('{CONTEXT, CREATE_EXAMPLE_PARAMS}', { CONTEXT, CREATE_EXAMPLE_PARAMS });
      throw new Error('Missing implementation & use case!');
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }

  if (ramda.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
