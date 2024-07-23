/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-router-users-export-users-permissions';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  usersPermissionsToExcel,
} from '@ibm-aiap/aiap-utils-xlsx';

import {
  accessGroupsService,
  tenantsService,
  usersService,
} from '@ibm-aiap/aiap-app-service';

export const exportUsersPermissions = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  let result;
  try {
    const CONTEXT = constructActionContextFromRequest(request);
    const PARAMS = request?.body;

    const PROMISES = [
      accessGroupsService.findManyByQuery(CONTEXT, PARAMS).then(response => response.items),
      tenantsService.findManyByQuery(CONTEXT, PARAMS).then(response => response.items),
      usersService.findManyByQuery(CONTEXT, PARAMS).then(response => response.items),
    ];

    const [ACCESS_GROUPS, TENANTS, USERS] = await Promise.all(PROMISES);

    result = await usersPermissionsToExcel(USERS, ACCESS_GROUPS, TENANTS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename=UsersPermissions.xlsx'
    })
    response.end(result);
  } else {
    logger.error('ERROR', ERRORS);
    response.status(500).json({ errors: ERRORS });
  }
}
