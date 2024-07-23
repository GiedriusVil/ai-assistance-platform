/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-applications-find-many-by-tenant-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IApplicationV1,
  IParamsV1FindApplicationsByTenantId,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import * as tenantsService from '../tenants';

export const findManyByTenantId = async (
  context: IContextV1,
  params: IParamsV1FindApplicationsByTenantId,
): Promise<Array<IApplicationV1>> => {
  try {
    const DATASOURCE = getDatasourceV1App();
    const TENANT_APPS = await DATASOURCE.applications.findManyByTenantId(context, params);

    const TENANT = await tenantsService.findOneById(context, { id: params?.tenantId });

    const RET_VAL = TENANT_APPS.map(application => {
      return {
        ...application,
        enabled: TENANT?.applications?.find(app => app.id === application.id)?.enabled ?? false,
      }
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findManyByTenantId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
