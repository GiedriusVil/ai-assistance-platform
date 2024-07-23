/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-runtime-data-synchronize-with-database-ai-services-by-tenant';
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
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

export const synchronizeWithDatabaseAiServicesByTenant = async (
  context: IContextV1,
  params: {
    configTenantCustomizerAbsolutePath: any,
    tenantId: any,
  },
) => {
  let configTenantCustomizerAiServicesAbsolutePath;
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
    configTenantCustomizerAiServicesAbsolutePath = `${params?.configTenantCustomizerAbsolutePath}/${params?.tenantId}/ai-services`;
    fsExtra.ensureDirSync(configTenantCustomizerAiServicesAbsolutePath);

    const AI_SERVICES_FILES = fsExtra.readdirSync(configTenantCustomizerAiServicesAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(AI_SERVICES_FILES) &&
      lodash.isArray(AI_SERVICES_FILES)
    ) {
      for (const AI_SERVICE_FILE of AI_SERVICES_FILES) {
        if (
          !lodash.isEmpty(AI_SERVICE_FILE) &&
          lodash.isString(AI_SERVICE_FILE) &&
          AI_SERVICE_FILE.endsWith('.json')
        ) {
          const AI_SERVICE = fsExtra.readJsonSync(`${configTenantCustomizerAiServicesAbsolutePath}/${AI_SERVICE_FILE}`)
          const DATASOURCE = getAiServicesDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.aiServices.saveOne(context, { value: AI_SERVICE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseAiServicesByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
