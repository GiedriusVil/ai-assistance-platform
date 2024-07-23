/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-express-routes-controllers-ai-translation-models-delete-many-by-service-model-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

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
  aiTranslationModelsService
} from '@ibm-aiap/aiap-ai-translation-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';


const deleteManyByServiceModelIds = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const AI_TRANSLATION_MODELS_IDS = request?.body?.ids;
  const AI_TRANSLATION_SERVICE_ID = request?.body?.aiTranslationServiceId;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_MODELS_IDS)
    ) {
      const MESSAGE = `Missing required request.body.ids paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_TRANSLATION_SERVICE_ID)
    ) {
      const MESSAGE = `Missing required request.body.aiTranslationServiceId paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = { ids: AI_TRANSLATION_MODELS_IDS, aiTranslationServiceId: AI_TRANSLATION_SERVICE_ID };
    result = await aiTranslationModelsService.deleteManyByServiceModelIds(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_TRANSLATION_MODELS_IDS });
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
  deleteManyByServiceModelIds,
};
