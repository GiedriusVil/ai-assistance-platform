/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-delete-many-by-keys';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const rulesChangesServiceV2 = require('../rules-changes')

const runtimeDataService = require('../runtime-data');

const saveAuditRecord = async (context, params) => {
  const KEYS = params?.keys;
  if (
    !lodash.isEmpty(KEYS) &&
    lodash.isArray(KEYS)
  ) {
    const PROMISES = [];
    KEYS?.forEach(key => {
      const AUDIT_RECORD = {
        action: 'DELETE',
        ruleKey: key,
        docType: 'RULE_V2'
      }
      logger.info('deleteManyByKeys audit', { AUDIT_RECORD });
      PROMISES.push(rulesChangesServiceV2.saveOne(context, { record: AUDIT_RECORD }));
    });
    await Promise.all(PROMISES);
  }
}

const deleteRulesConditions = async (context, datasource, rulesKeys) => {
  const PROMISES = [];
  for (let ruleKey of rulesKeys) {
    const PARAMS = {
      ruleKey
    };
    PROMISES.push(datasource.rulesConditions.deleteManyByRuleKey(context, PARAMS));
  }
  await Promise.all(PROMISES);

  await runtimeDataService.deleteManyByKeysFromConfigDirectoryRulesConditions(context, { keys: rulesKeys });
}

const deleteManyByKeys = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.rules.deleteManyByKeys(context, params);
    if (!lodash.isEmpty(RET_VAL)) {
      saveAuditRecord(context, params);
    }
    const RULES_KEYS = params?.keys;

    await deleteRulesConditions(context, DATASOURCE, RULES_KEYS);

    await runtimeDataService.deleteManyByKeysFromConfigDirectoryRules(context, params);
    
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByKeys.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByKeys,
}
