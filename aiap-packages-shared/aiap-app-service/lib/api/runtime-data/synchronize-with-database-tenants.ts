/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-runtime-data-service-synchronize-with-database-tenants';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

const synchroniseWithDatabaseTenant = async (
  context: IContextV1,
  params: {
    tenantConfigAbsolutePath: any,
  },
) => {
  let retVal;

  let tenant;
  try {
    if (
      lodash.isEmpty(params?.tenantConfigAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantConfigAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    tenant = fsExtra.readJSONSync(params?.tenantConfigAbsolutePath);
    if (
      lodash.isEmpty(tenant?.id)
    ) {
      const ERROR_MESSAGE = `Missing required attribute tenant?.id!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const DATASOURCE = getDatasourceV1App();
    retVal = await DATASOURCE.tenants.saveOne(context, { value: tenant });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(synchroniseWithDatabaseTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
  return retVal;
}

export const synchronizeWithDatabaseTenants = async (
  context: IContextV1,
  params: {
    configAbsolutePath: any,
  },
) => {
  let configAbsolutePathTenants;
  let directory;
  const RET_VAL: Array<any> = [];
  try {
    if (
      lodash.isEmpty(params?.configAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configAbsolutePathTenants = `${params?.configAbsolutePath}/runtime-data-local/portal/tenants`;
    fsExtra.ensureDirSync(configAbsolutePathTenants);
    directory = fsExtra.readdirSync(configAbsolutePathTenants);
    if (
      !lodash.isEmpty(directory) &&
      lodash.isArray(directory)
    ) {
      const PROMISES = [];
      for (const TENANT_CONFIGURATION_FILE of directory) {
        if (
          !lodash.isEmpty(TENANT_CONFIGURATION_FILE) &&
          TENANT_CONFIGURATION_FILE.endsWith('.json')
        ) {
          PROMISES.push(synchroniseWithDatabaseTenant(context, {
            tenantConfigAbsolutePath: `${configAbsolutePathTenants}/${TENANT_CONFIGURATION_FILE}`
          }));
        }
      }
      const TENANTS = await Promise.all(PROMISES);
      if (
        !lodash.isEmpty(TENANTS) &&
        lodash.isArray(TENANTS)
      ) {
        for (const TENANT of TENANTS) {
          if (
            !lodash.isEmpty(TENANT?.id)
          ) {
            RET_VAL.push(TENANT?.id);
          }
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseTenants.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
