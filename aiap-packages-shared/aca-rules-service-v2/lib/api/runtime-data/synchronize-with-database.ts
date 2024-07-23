/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-service-runtime-data-synchronize-with-database';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import path from 'path';
import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getLibConfiguration } from '../../configuration';

import { getAppDatasource } from '../datasource.utils';

import { synchronizeWithDatabaseByTenantRules } from './synchronize-with-database-by-tenant-rules';
import { synchronizeWithDatabaseByTenantRulesConditions } from './synchronize-with-database-by-tenant-rules-conditions';


const _synchronizeWithDatabaseByTenant = async (context, params) => {
  let tenant;
  try {
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.tenantId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const APP_DATASOURCE = getAppDatasource(context);
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
    const RULES = await synchronizeWithDatabaseByTenantRules(CONTEXT, params);
    const RULES_CONDITIONS = await synchronizeWithDatabaseByTenantRulesConditions(CONTEXT, params);
    const RET_VAL = {
      tenantId: params?.tenantId,
      rules: RULES,
      rulesConditions: RULES_CONDITIONS,
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
  let configPolicyManagerAbsolutePath;

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
      configPolicyManagerAbsolutePath = `${configAbsolutePath}/runtime-data-local/policy-manager`;
      fsExtra.ensureDirSync(configPolicyManagerAbsolutePath);

      const TENANT_DIRS = fsExtra.readdirSync(configPolicyManagerAbsolutePath);
      const PROMISES: any = [];
      for (const TENANT_ID of TENANT_DIRS) {
        const PARAMS = {
          configPolicyManagerAbsolutePath,
          tenantId: TENANT_ID,
        };
        PROMISES.push(_synchronizeWithDatabaseByTenant({}, PARAMS));
      }

      const PROMISES_RESULTS = await Promise.all(PROMISES);
      if (
        lodash.isEmpty(PROMISES_RESULTS) &&
        lodash.isArray(PROMISES_RESULTS)
      ) {
        for (const RESULT of PROMISES_RESULTS) {
          logger.info(`Policy Manager Organizations synchronized [TenantId: ${RESULT?.tenantId}, QTY.: ${RESULT?.rules?.length}]`);
          logger.info(`Policy Manager Organizations synchronized [TenantId: ${RESULT?.tenantId}, QTY.: ${RESULT?.rulesConditions?.length}]`);
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
