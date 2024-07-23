/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-routes-controllers-connections-test-redis-connection';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  connectionsService,
} from '@ibm-aiap/aiap-app-service';

export const testRedisConnection = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);

  const CONFIGURATION = request?.body?.configuration;

  let retVal;
  try {
    if (
      lodash.isEmpty(CONFIGURATION)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.configuration parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const PARAMS = { configuration: CONFIGURATION };
    const TEST_PASSED = await connectionsService.testRedisConnection(PARAMS);
    if (
      !TEST_PASSED
    ) {
      const ERROR_MESSAGE = `Unable to establish connection!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    retVal = { status: 'PASSED' };
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(testRedisConnection.name, { ERRORS });
    response.status(500).json(ERRORS);
  }
}
