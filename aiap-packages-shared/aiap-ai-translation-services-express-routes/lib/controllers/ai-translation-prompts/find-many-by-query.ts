/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-express-routes-controllers-ai-translation-prompts-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  aiTranslationPromptsService
} from '@ibm-aiap/aiap-ai-translation-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';


const findManyByQuery = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const QUERY = request?.body?.query;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(QUERY)
    ) {
      const MESSAGE = `Missing required request.body.query parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const AI_TRANSLATION_SERVICE_ID = QUERY?.filter?.aiTranslationServiceId;
    if (
      lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required request.body.query.filter.aiTranslationServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      ...QUERY
    };
    result = await aiTranslationPromptsService.findManyByQuery(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, QUERY });
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
};

export {
  findManyByQuery,
};
