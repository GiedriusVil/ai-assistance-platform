/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-translation-services-express-routes-controllers-ai-translation-services-test-one-by-service-model-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  constructActionContextFromRequest
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  aiTranslationPromptsService
} from '@ibm-aiap/aiap-ai-translation-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';


const testByPromptId = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];

  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;

  const AI_TRANSLATION_SERVICE_ID = request?.body?.aiTranslationServiceId;
  const AI_TRANSLATION_PROMPT_ID = request?.body?.aiTranslationPromptId;
  const TEXT = request?.body?.text;

  let result;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiTranslationServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_TRANSLATION_PROMPT_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiTranslationPromptId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TEXT)
    ) {
      const MESSAGE = `Missing required request.body.text parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PARAMS = {
      aiTranslationServiceId: AI_TRANSLATION_SERVICE_ID,
      aiTranslationPromptId: AI_TRANSLATION_PROMPT_ID,
      text: TEXT,
    };
    result = await aiTranslationPromptsService.translateTextByPromptId(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
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
  testByPromptId,
};
