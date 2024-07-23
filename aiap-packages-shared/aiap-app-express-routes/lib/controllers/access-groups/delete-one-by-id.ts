/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-routes-controllers-access-groups-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteAccessGroupByIdAndUpdateUsers,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  accessGroupsService,
} from '@ibm-aiap/aiap-app-service';

export const deleteOneById = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  let retVal;
  try {
    const CONTEXT: IContextV1 = constructActionContextFromRequest(request);
    const ID = request?.body?.id;
    if (
      lodash.isEmpty(ID)
    ) {
      const ERROR_MESSAGE = `Missing required request.body.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const PARAMS: IParamsV1DeleteAccessGroupByIdAndUpdateUsers = {
      id: ID
    };
    retVal = await accessGroupsService.deleteOneByIdAndUpdateUsers(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(deleteOneById.name, { ERRORS });
    response.status(500).json(ERRORS);
  }
}
