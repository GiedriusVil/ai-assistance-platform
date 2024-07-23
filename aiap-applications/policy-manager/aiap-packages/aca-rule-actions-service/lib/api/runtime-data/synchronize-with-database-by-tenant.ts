/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-actions-service-runtime-data-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getRuleActionsDatasource } from '../datasource.utils';

const synchronizeWithDatabaseByTenant = async (context, params) => {
  let configPolicyManagerRulesActionsAbsolutePath;
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
    configPolicyManagerRulesActionsAbsolutePath = `${params?.configPolicyManagerAbsolutePath}/${params?.tenantId}/rules-actions`;
    fsExtra.ensureDirSync(configPolicyManagerRulesActionsAbsolutePath);

    const RULES_ACTIONS_FILES = fsExtra.readdirSync(configPolicyManagerRulesActionsAbsolutePath);
    const PROMISES: any = [];
    if (
      !lodash.isEmpty(RULES_ACTIONS_FILES) &&
      lodash.isArray(RULES_ACTIONS_FILES)
    ) {
      for (const RULES_ACTIONS_FILE of RULES_ACTIONS_FILES) {
        if (
          !lodash.isEmpty(RULES_ACTIONS_FILE) &&
          lodash.isString(RULES_ACTIONS_FILE) &&
          RULES_ACTIONS_FILE.endsWith('.json')
        ) {
          const RULES_ACTIONS = fsExtra.readJsonSync(`${configPolicyManagerRulesActionsAbsolutePath}/${RULES_ACTIONS_FILE}`)
          const DATASOURCE = getRuleActionsDatasource(context);
          PROMISES.push(
            DATASOURCE.actions.saveOne(context, { value: RULES_ACTIONS })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabaseByTenant,
}
