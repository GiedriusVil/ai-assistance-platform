/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-service-runtime-data-service-synchronize-with-database';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { 
  formatIntoAcaError, 
  appendDataToError, 
  throwAcaError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';

import path from 'path';
import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { 
  getLibConfiguration 
} from '../../configuration';

import { 
  getAppDatasourceByContext 
} from '../datasource.utils';

import { 
  synchronizeWithDatabaseConfigurationsByTenant 
} from './synchronize-with-database-configurations-by-tenant';
import { 
  synchronizeWithDatabaseModulesByTenant 
} from './synchronize-with-database-modules-by-tenant';

const _synchronizeWithDatabaseByTenant = async (context, params) => {
  let tenant;
  try {
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.tenantId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const APP_DATASOURCE = getAppDatasourceByContext(context);
    const PARAMS = { id: params?.tenantId };
    tenant = await APP_DATASOURCE.tenants.findOneById(context, PARAMS);
    if (
      lodash.isEmpty(tenant)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve tenant. Check portal spin-up!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const CONTEXT = {
      ...context,
      user: {
        session: {
          tenant: tenant,
        }
      }
    }
    const CONFIGURATIONS = await synchronizeWithDatabaseConfigurationsByTenant(CONTEXT, params);
    const MODULES = await synchronizeWithDatabaseModulesByTenant(CONTEXT, params);
    const RET_VAL = {
      tenantId: params?.tenantId,
      configurations: CONFIGURATIONS,
      modules: MODULES,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      params,
    });
    logger.error(_synchronizeWithDatabaseByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

const synchronizeWithDatabase = async (context, params) => {
  const AIAP_DIR_CONFIG = process?.env?.AIAP_DIR_CONFIG;
  let configurationLocalSyncEnabled = false;
  let configAbsolutePath;
  let configTenantCustomizerAbsolutePath;

  try {
    configurationLocalSyncEnabled = getLibConfiguration().configurationLocalSyncEnabled;
    if (
      !lodash.isEmpty(AIAP_DIR_CONFIG) &&
      configurationLocalSyncEnabled
    ) {
      configAbsolutePath = path.resolve(__dirname, `../../../../../../${AIAP_DIR_CONFIG}`);
      if (
        !fsExtra.existsSync(configAbsolutePath)
      ) {
        const ERROR_MESSAGE = `Missing configuration repository!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
      }
      configTenantCustomizerAbsolutePath = `${configAbsolutePath}/runtime-data-local/tenant-customizer`;
      fsExtra.ensureDirSync(configTenantCustomizerAbsolutePath);

      const TENANT_DIRS = fsExtra.readdirSync(configTenantCustomizerAbsolutePath);
      const PROMISES = [];
      for (let tenantId of TENANT_DIRS) {
        let params = {
          configTenantCustomizerAbsolutePath,
          tenantId,
        };
        PROMISES.push(_synchronizeWithDatabaseByTenant({}, params));
      }

      const PROMISES_RESULTS = await Promise.all(PROMISES);
      if (
        !lodash.isEmpty(PROMISES_RESULTS) &&
        lodash.isArray(PROMISES_RESULTS)
      ) {
        for (let result of PROMISES_RESULTS) {
          logger.info(`TenantCustomizer Lambda Modules synchronized [TenantID: ${result?.tenantId}, QTY.: ${result?.modules?.length}]`);
          logger.info(`TenantCustomizer Lambda Modules Configurations synchronized [TenantID: ${result?.tenantId}, QTY.: ${result?.configurations?.length}]`);
        }
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      configurationLocalSyncEnabled,
      AIAP_DIR_CONFIG,
      configAbsolutePath,
    });
    logger.error(synchronizeWithDatabase.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabase,
}
