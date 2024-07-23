/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-tenants-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  IParamsV1ExportTenantsByQuery,
} from '@ibm-aiap/aiap--types-domain-app';

export const exportMany = async (
  context: IContextV1,
  params: IParamsV1ExportTenantsByQuery,
) => {
  try {
    const DATASOURCE = getDatasourceV1App();
    const RESULT = await DATASOURCE.tenants.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

