/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-express-routes-ai-skills-find-one-by-id';
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

export const findOneById = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = CONTEXT?.user?.id;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(request?.body?.id)
    ) {
      const MESSAGE = `Missing required params.body.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS: any = {
      id: request?.body?.id,
      options: {},
    }
    if (
      request?.body?.options?.addIntents
    ) {
      PARAMS.options.addIntents = true;
    }
    if (
      request?.body?.options?.addEntities
    ) {
      PARAMS.options.addEntities = true;
    }
    if (
      request?.body?.options?.addActions
    ) {
      PARAMS.options.addActions = true;
    }
    result = await aiSkillsService.findOneById(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERRROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERRROR, { CONTEXT_USER_ID });
    ERRORS.push(ACA_ERRROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
