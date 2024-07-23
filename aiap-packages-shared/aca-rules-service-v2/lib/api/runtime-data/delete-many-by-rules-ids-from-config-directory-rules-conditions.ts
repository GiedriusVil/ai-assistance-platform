/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-conditions-service-runtime-data-delete-many-by-ids-from-config-directory';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import path from 'path';
import { fsExtra } from '@ibm-aca/aca-wrapper-fs-extra';

import { getLibConfiguration } from '../../configuration';

const deleteManyByRulesIdsFromConfigDirectoryRulesConditions = async (context, params) => {
  const AIAP_DIR_CONFIG = process?.env?.AIAP_DIR_CONFIG;
  let configurationLocalSyncEnabled = false;
  let configAbsolutePath;
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
      if (
        lodash.isEmpty(context?.user?.session?.tenant?.id)
      ) {
        const ERROR_MESSAGE = `Missing required parameter context?.user?.session?.tenant?.id!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
      }

      const DIR_RULES_MEESAGES = `${configAbsolutePath}/runtime-data-local/policy-manager/${context?.user?.session?.tenant?.id}/rules-v2-conditions`;
      fsExtra.ensureDirSync(DIR_RULES_MEESAGES);

      if (
        !lodash.isEmpty(params?.ids) &&
        lodash.isArray(params?.ids)
      ) {
        const FILES = fsExtra.readdirSync(DIR_RULES_MEESAGES);
        for (const FILE of FILES) {
          const RULE_CONDITION = fsExtra.readJsonSync(`${DIR_RULES_MEESAGES}/${FILE}`);
          if (params.ids.includes(RULE_CONDITION.ruleId)) {
            fsExtra.removeSync(
              `${DIR_RULES_MEESAGES}/${FILE}`
            );
          }
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
    logger.error(deleteManyByRulesIdsFromConfigDirectoryRulesConditions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  deleteManyByRulesIdsFromConfigDirectoryRulesConditions,
}
