/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-express-routes-controllers-ai-translation-model-examples-delete-many-by-ids';
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
  aiTranslationModelExamplesService
} from '@ibm-aiap/aiap-ai-translation-services-service';

import {
  IContextV1,
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

import {
  IAiTranslationModelExamplesDeleteManyByIdsParamsV1
} from '../../types/params';


const deleteManyByIds = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT: IContextV1 = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;
  const AI_TRANSLATION_MODEL_EXAMPE_IDS = request?.body?.ids;
  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(AI_TRANSLATION_MODEL_EXAMPE_IDS)
    ) {
      const MESSAGE = `Missing required request.body.ids paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS: IAiTranslationModelExamplesDeleteManyByIdsParamsV1 = {
      ids: AI_TRANSLATION_MODEL_EXAMPE_IDS
    };

    result = await aiTranslationModelExamplesService.deleteManyByIds(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_TRANSLATION_MODEL_EXAMPE_IDS });
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
  deleteManyByIds,
};
