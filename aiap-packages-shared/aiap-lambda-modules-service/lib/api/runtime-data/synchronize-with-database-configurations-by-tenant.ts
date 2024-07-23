/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-lambda-modules-service-runtime-data-service-synchronize-with-database-configurations-by-tenant`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';

import { 
  formatIntoAcaError, 
  throwAcaError, 
  ACA_ERROR_TYPE 
} from '@ibm-aca/aca-utils-errors';

import { 
  fsExtra 
} from '@ibm-aca/aca-wrapper-fs-extra';

import { 
  getDatasourceByContext 
} from '../datasource.utils';

const synchronizeWithDatabaseConfigurationsByTenant = async (context: IContextV1, params) => {
  let configTenantCustomizerEntitiesAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configTenantCustomizerAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configTenantCustomizerAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configTenantCustomizerEntitiesAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/lambda-modules-configurations`;
    fsExtra.ensureDirSync(configTenantCustomizerEntitiesAbsolutePath);

    const ENTITIES_FILES = fsExtra.readdirSync(configTenantCustomizerEntitiesAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(ENTITIES_FILES) &&
      lodash.isArray(ENTITIES_FILES)
    ) {
      for (let entityJsonFile of ENTITIES_FILES) {
        if (
          !lodash.isEmpty(entityJsonFile) &&
          lodash.isString(entityJsonFile) &&
          entityJsonFile.endsWith('.json')
        ) {
          const ENTITY = fsExtra.readJsonSync(`${configTenantCustomizerEntitiesAbsolutePath}/${entityJsonFile}`);
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.modulesConfigurations.saveOne(context, { value: ENTITY })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseConfigurationsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabaseConfigurationsByTenant,
}
