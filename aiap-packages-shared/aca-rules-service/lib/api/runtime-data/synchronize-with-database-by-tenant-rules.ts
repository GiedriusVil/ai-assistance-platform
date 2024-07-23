/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-runtime-data-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getDatasourceByContext } from '../datasource.utils';

const synchronizeWithDatabaseByTenantRules = async (context, params) => {
  let configPolicyManagerRulesAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configPolicyManagerAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configPolicyManagerAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configPolicyManagerRulesAbsolutePath = `${params?.configPolicyManagerAbsolutePath}/${params?.tenantId}/rules`;
    fsExtra.ensureDirSync(configPolicyManagerRulesAbsolutePath);

    const RULES_FILES = fsExtra.readdirSync(configPolicyManagerRulesAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(RULES_FILES) &&
      lodash.isArray(RULES_FILES)
    ) {
      for (const RULES_FILE of RULES_FILES) {
        if (
          !lodash.isEmpty(RULES_FILE) &&
          lodash.isString(RULES_FILE) &&
          RULES_FILE.endsWith('.json')
        ) {
          const RULE = fsExtra.readJsonSync(`${configPolicyManagerRulesAbsolutePath}/${RULES_FILE}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.rules.saveOne(context, { rule: RULE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseByTenantRules.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabaseByTenantRules,
}
