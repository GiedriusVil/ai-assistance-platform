/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-express-routes-controllers-ai-translation-model-examples-export-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  currentDateAsString
} from '@ibm-aiap/aiap-utils-date';

import {
  constructActionContextFromRequest,
  constructParamsV1DefaultFindManyQueryFromRequest,
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
  IAiTranslationModelExamplesFindManyByQueryParamsV1
} from '../../types/params';


const _constructFileName = (
  context: IContextV1
) => {
  try {
    const TENANT_ID = context?.user?.session?.tenant?.id;
    const RET_VAL = `[${TENANT_ID}]ai-translation-model-examples.${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_constructFileName', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _enrichParamsWithFilter = (
  params,
  aiTranslationModelId: any
) => {
  if (lodash.isEmpty(params)) {
    const MESSAGE = `Find many query params is empty!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
  }

  if (lodash.isEmpty(params?.filter)) {
    params.filter = {};
  }

  if (lodash.isEmpty(params?.filter?.aiTranslationModelId)) {
    params.filter.aiTranslationModelId = aiTranslationModelId;
  }
}

const exportManyByQuery = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER = CONTEXT?.user;
  const USER_ID = USER?.id;
  const AI_TRANSLATION_MODEL_ID = request?.query?.ai_translation_model_id;
  const PARAMS: IAiTranslationModelExamplesFindManyByQueryParamsV1
    = constructParamsV1DefaultFindManyQueryFromRequest(request);

  _enrichParamsWithFilter(PARAMS?.query, AI_TRANSLATION_MODEL_ID);

  const ERRORS = [];
  let result;
  try {
    const RESULT = await aiTranslationModelExamplesService.findManyByQuery(CONTEXT, PARAMS?.query);
    const ITEMS = ramda.path(['items'], RESULT);
    if (
      lodash.isEmpty(ITEMS)
    ) {
      const MESSAGE = `Unable to find ai-translation-model-examples!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    result = ITEMS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, PARAMS });
    ERRORS.push({ ACA_ERROR });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    const FILE_NAME = _constructFileName(CONTEXT);
    response.setHeader('Content-disposition', `attachment; filename=${FILE_NAME}`);
    response.set('Content-Type', 'application/json');
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(400).json(ERRORS);
  }
};

export {
  exportManyByQuery,
};
