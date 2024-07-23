/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-messages-service-runtime-data-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getDatasourceByContext } from '../datasource.utils';

const synchronizeWithDatabaseByTenantRulesMessages = async (context, params) => {
  let configPolicyManagerRulesMessagesAbsolutePath;
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
    configPolicyManagerRulesMessagesAbsolutePath = `${params?.configPolicyManagerAbsolutePath}/${params?.tenantId}/rules-messages`;
    fsExtra.ensureDirSync(configPolicyManagerRulesMessagesAbsolutePath);

    const RULES_MESSAGES_FILES = fsExtra.readdirSync(configPolicyManagerRulesMessagesAbsolutePath);
    const PROMISES = [];
    if (
      !lodash.isEmpty(RULES_MESSAGES_FILES) &&
      lodash.isArray(RULES_MESSAGES_FILES)
    ) {
      for (const RULES_MESSAGES_FILE of RULES_MESSAGES_FILES) {
        if (
          !lodash.isEmpty(RULES_MESSAGES_FILE) &&
          lodash.isString(RULES_MESSAGES_FILE) &&
          RULES_MESSAGES_FILE.endsWith('.json')
        ) {
          const RULES_MESSAGE = fsExtra.readJsonSync(`${configPolicyManagerRulesMessagesAbsolutePath}/${RULES_MESSAGES_FILE}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.rulesMessages.saveOne(context, { message: RULES_MESSAGE })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseByTenantRulesMessages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  synchronizeWithDatabaseByTenantRulesMessages,
}
