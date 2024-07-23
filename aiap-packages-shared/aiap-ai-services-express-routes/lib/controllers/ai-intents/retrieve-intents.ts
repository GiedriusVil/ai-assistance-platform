/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-intents-retrieve-intents';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const retrieveIntents = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  let result;
  try {
    const SERVICE_ID = ramda.path(['params', 'serviceId'], request);
    const SKILL_ID = ramda.path(['params', 'skillId'], request);
    if (
      lodash.isEmpty(ERRORS)
    ) {
      const CONTEXT = constructActionContextFromRequest(request);
      const PARAMS = {
        aiServiceId: SERVICE_ID,
        aiSkillId: SKILL_ID,
      }
      throw new Error('API is under refactoring!');
      // result = await aiIntentsService.retrieveIntents(CONTEXT, PARAMS);
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
