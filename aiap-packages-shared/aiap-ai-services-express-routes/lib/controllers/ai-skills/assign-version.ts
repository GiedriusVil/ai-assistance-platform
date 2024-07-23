/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-express-routes-assign-version';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const assignVersion = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const CONTEXT_USER_ID = CONTEXT?.user?.id;
  const ERRORS = [];
  let result;
  try {
    throw new Error('API is under refactoring!');
    // const PARAMS = {
    //   id: request?.body?.id,
    // };
    // await aiSkillsService.promoteSkillById(CONTEXT, PARAMS);
    // result = { status: 'SUCCESS' };
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
