/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-service-express-routes-controllers-ai-translation-services-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  aiTranslationServicesService
} from '@ibm-aiap/aiap-ai-translation-services-service';

import {
  IExpressRequestWithFileV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';


const importManyFromFile = async (
  request: IExpressRequestWithFileV1,
  response: IExpressResponseV1
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER_ID = CONTEXT?.user?.id;

  const FILE = request?.file;

  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(FILE)
    ) {
      const MESSAGE = 'Missing required request.file paramater!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      file: FILE,
    };
    result = await aiTranslationServicesService.importMany(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, FILE });
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
  importManyFromFile,
};
