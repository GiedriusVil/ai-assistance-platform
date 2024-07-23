/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-express-routes-controllers-tenants-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IExpressRequestV1,
  IExpressResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1ExportTenantsByQuery,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  currentDateAsString,
} from '@ibm-aiap/aiap-utils-date';

import {
  constructActionContextFromRequest,
  constructParamsV1DefaultFindManyQueryFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  tenantsService,
} from '@ibm-aiap/aiap-app-service';

const _constructFileName = (
  context: IContextV1,
) => {
  try {
    const TENANT_ID = context?.user?.session?.tenant?.id;
    const RET_VAL = `[${TENANT_ID}]tenants.${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_constructFileName.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const exportMany = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  let result;
  try {
    const PARAMS: IParamsV1ExportTenantsByQuery = constructParamsV1DefaultFindManyQueryFromRequest(request);
    if (
      lodash.isArray(request?.query?.ids)
    ) {
      PARAMS.query.filter.ids = request?.query?.ids as Array<any>;
    }
    // else if (lodash.isString(request?.query?.ids)) {
    //   PARAMS.ids = [request?.query?.ids];
    // }
    const DATA = await tenantsService.exportMany(CONTEXT, PARAMS);
    if (
      lodash.isEmpty(DATA)
    ) {
      const ERROR_MESSAGE = `Unable to find tenants!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    result = DATA;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
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
    logger.error(exportMany.name, { ERRORS });
    response.status(400).json(ERRORS);
  }
}
