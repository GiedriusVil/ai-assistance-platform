/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-express-routes-controller-engagements-import-many-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  engagementsService
} from '@ibm-aiap/aiap-engagements-service';

import {
  IExpressRequestWithFileV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const importManyFromFile = async (
  request: IExpressRequestWithFileV1,
  response: IExpressResponseV1
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const FILE = request?.file;

  const ERRORS = [];
  let result;
  try {
    if (
      lodash.isEmpty(FILE)
    ) {
      const MESSAGE = 'Missing engagements file!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      file: FILE,
    };
    result = await engagementsService.importMany(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('ERRORS', { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }

};
