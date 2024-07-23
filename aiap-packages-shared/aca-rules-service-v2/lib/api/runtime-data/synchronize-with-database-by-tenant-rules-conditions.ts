/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-conditions-service-runtime-data-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getDatasourceByContext } from '../datasource.utils';

const synchronizeWithDatabaseByTenantRulesConditions = async (context, params) => {
  let configPolicyManagerRulesConditionsAbsolutePath;
  let retVal: any = [];
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
    configPolicyManagerRulesConditionsAbsolutePath = `${params?.configPolicyManagerAbsolutePath}/${params?.tenantId}/rules-v2-conditions`;
    fsExtra.ensureDirSync(configPolicyManagerRulesConditionsAbsolutePath);

    const RULES_CONDITIONS_FILES = fsExtra.readdirSync(configPolicyManagerRulesConditionsAbsolutePath);
    const PROMISES: any = [];
    if (
      !lodash.isEmpty(RULES_CONDITIONS_FILES) &&
      lodash.isArray(RULES_CONDITIONS_FILES)
    ) {
      for (const RULES_CONDITIONS_FILE of RULES_CONDITIONS_FILES) {
        if (
          !lodash.isEmpty(RULES_CONDITIONS_FILE) &&
          lodash.isString(RULES_CONDITIONS_FILE) &&
          RULES_CONDITIONS_FILE.endsWith('.json')
        ) {
          const RULE_CONDITION = fsExtra.readJsonSync(`${configPolicyManagerRulesConditionsAbsolutePath}/${RULES_CONDITIONS_FILE}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.rulesConditions.saveOne(context, { condition: RULE_CONDITION })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseByTenantRulesConditions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabaseByTenantRulesConditions,
}
