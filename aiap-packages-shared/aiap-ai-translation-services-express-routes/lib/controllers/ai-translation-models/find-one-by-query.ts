/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-express-routes-controllers-ai-translation-services-find-one-by-id';
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
  aiTranslationModelsService
} from '@ibm-aiap/aiap-ai-translation-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';


const findOneByQuery = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];

  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;

  const QUERY = request?.body?.query;
  let options = request?.body?.options;

  let result;
  try {
    if (
      lodash.isEmpty(QUERY)
    ) {
      const MESSAGE = `Missing required request.body.query parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      lodash.isEmpty(options)
    ) {
      options = {
        refreshStatus: false
      };
    }

    const PARAMS = {
      ...QUERY,
      options,
    };
    result = await aiTranslationModelsService.findOneByQuery(CONTEXT, PARAMS);
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
  findOneByQuery,
};
