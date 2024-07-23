/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-applications-find-many-by-tenant-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  // types
  IApplicationV1,
  // api
  IParamsV1FindApplicationsByTenantId,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  DatasourceAppV1Mongo,
} from '..';

import {
  findOneById as findTenantById,
} from '../tenants/find-one-by-id';

import {
  findOneById,
} from './find-one-by-id';

export const findManyByTenantId = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1FindApplicationsByTenantId,
): Promise<Array<IApplicationV1>> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let tenantId;
  let tenant;
  let applications;

  try {
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const MESSAGE = `Required parameter params.tenantId is missing!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    tenantId = params?.tenantId;
    tenant = await findTenantById(datasource, context, { id: tenantId });

    if (
      lodash.isEmpty(tenant)
    ) {
      const MESSAGE = `Unable to retrieve tenant!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    applications = tenant?.applications;

    const PROMISES = [];
    if (
      lodash.isArray(applications) &&
      !lodash.isEmpty(applications)
    ) {
      for (const APPLICATION of applications) {
        const APPLICATION_ID = APPLICATION?.id;
        if (
          !lodash.isEmpty(APPLICATION_ID)
        ) {
          PROMISES.push(findOneById(datasource, context, { id: APPLICATION_ID }));
        }
      }
    }
    const TENANT_APPLICATIONS = await Promise.all(PROMISES);
    const RET_VAL = TENANT_APPLICATIONS.filter(application => !lodash.isEmpty(application));
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, tenantId });
    logger.error(findManyByTenantId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
