/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-express-routes-controllers-ai-translation-services-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

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
  aiTranslationServicesService
} from '@ibm-aiap/aiap-ai-translation-services-service';

import {
  IExpressRequestWithFileV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';


const saveOne = async (
  request: IExpressRequestWithFileV1,
  response: IExpressResponseV1
) => {
  const ERRORS = [];

  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;

  const AI_TRANSLATION_SERVICE = request?.body?.aiTranslationService;
  const OPTIONS = request?.body?.options;

  let result;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_SERVICE)
    ) {
      const MESSAGE = `Missing required request.body.aiTranslationService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PARAMS = { value: AI_TRANSLATION_SERVICE, options: OPTIONS };
    result = await aiTranslationServicesService.saveOne(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_TRANSLATION_SERVICE, OPTIONS })
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
  saveOne,
};
