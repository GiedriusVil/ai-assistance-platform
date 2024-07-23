/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-routes-controllers-users-update-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  fromBase64ToString,
} from '@ibm-aca/aca-utils-codec';

import {
  usersService,
} from '@ibm-aiap/aiap-app-service';

export const updateOne = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const USER = request?.body;
    if (
      !lodash.isEmpty(USER.password)
    ) {
      const DECODED_PASSWORD = fromBase64ToString({ input: USER?.password });
      USER.password = DECODED_PASSWORD;
    }
    const PARAMS = {
      value: USER
    };
    retVal = await usersService.updateOne(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(updateOne.name, { ERRORS });
    response.status(500).json(ERRORS);
  }
}
