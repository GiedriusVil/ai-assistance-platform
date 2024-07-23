/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-routes-controllers-user-sessions-terminate';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUserToken,
  IUserV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  usersService,
} from '@ibm-aiap/aiap-app-service';

export const terminate = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  let retVal;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const USER = CONTEXT?.user as IUserV1;
    const ID = USER?.id;

    if (
      lodash.isEmpty(ERRORS)
    ) {
      const PARAMS: IParamsV1UpdateUserToken = {
        value: USER,
      };

      usersService.updateOneToken(CONTEXT, PARAMS);
      retVal = {
        ID,
      };
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(terminate.name, { ERRORS });
    response.status(500).json(ERRORS);
  }
}
