/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-runtime-data-service-synchronize-with-database';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const path = require('path');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  fsExtra,
} from '@ibm-aca/aca-wrapper-fs-extra';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  getLibConfiguration,
} from '../../configuration';

import {
  getAppDatasource,
} from '../utils/datasource-utils';

import { synchronizeWithDatabaseAiServicesByTenant } from './synchronize-with-database-ai-services-by-tenant';
import { synchronizeWithDatabaseAiSkillsByTenant } from './synchronize-with-database-ai-skills-by-tenant';

const _synchronizeWithDatabaseByTenant = async (
  context: IContextV1,
  params: {
    tenantId: any,
    configTenantCustomizerAbsolutePath: any,
  },
) => {
  let tenant;
  try {
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required params?.tenantId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const APP_DATASOURCE = getAppDatasource();
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
    const AI_SERVICES = await synchronizeWithDatabaseAiServicesByTenant(CONTEXT, params);
    const AI_SKILLS = await synchronizeWithDatabaseAiSkillsByTenant(CONTEXT, params);
    const RET_VAL = {
      tenantId: params?.tenantId,
      aiServices: AI_SERVICES,
      aiSkills: AI_SKILLS,
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

export const synchronizeWithDatabase = async (
  context: IContextV1,
  params: any,
) => {
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
      for (const TENANT_ID of TENANT_DIRS) {
        const PARAMS = {
          configTenantCustomizerAbsolutePath: configTenantCustomizerAbsolutePath,
          tenantId: TENANT_ID,
        };
        PROMISES.push(_synchronizeWithDatabaseByTenant(context, PARAMS));
      }

      const PROMISES_RESULTS = await Promise.all(PROMISES);
      if (
        lodash.isEmpty(PROMISES_RESULTS) &&
        lodash.isArray(PROMISES_RESULTS)
      ) {
        for (const RESULT of PROMISES_RESULTS) {
          logger.info(`TenantCustomizer AiServices synchronized [TenantId: ${RESULT?.tenantId}, QTY.: ${RESULT?.aiServices?.length}]`);
          logger.info(`TenantCustomizer AiSkills synchronized [TenantId: ${RESULT?.tenantId}, QTY.: ${RESULT?.aiSkills?.length}]`);
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
