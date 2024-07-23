/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-intents-retrieve-examples';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

export const retrieveExamples = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const SERVICE_ID = ramda.path(['params', 'serviceId'], request);
    const SKILL_ID = ramda.path(['params', 'skillId'], request);
    const INTENT_ID = ramda.path(['params', 'id'], request);
    if (lodash.isEmpty(ERRORS)) {
      const CONTEXT = constructActionContextFromRequest(request);
      const RETRIEVE_EXAMPLES_PARAMS = {
        aiServiceId: SERVICE_ID,
        aiSkillId: SKILL_ID,
        intentId: INTENT_ID,
      }
      const MESSAGE = `This API is under refactoring!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      // logger.info('CONTEXT, RETRIEVE_EXAMPLES_PARAMS', { CONTEXT, RETRIEVE_EXAMPLES_PARAMS });
      // result = await aiIntentsService.retrieveExamples(CONTEXT, RETRIEVE_EXAMPLES_PARAMS);
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
