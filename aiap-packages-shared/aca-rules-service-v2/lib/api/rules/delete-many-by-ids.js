/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const rulesChangesServiceV2 = require('../rules-changes')

const runtimeDataService = require('../runtime-data');

const saveAuditRecord = async (context, params) => {
  const IDS = params?.ids;
  if (
    !lodash.isEmpty(IDS) &&
    lodash.isArray(IDS)
  ) {
    const PROMISES = [];
    IDS?.forEach(id => {
      const AUDIT_RECORD = {
        action: 'DELETE',
        ruleId: id,
        docType: 'RULE_V2'
      }
      logger.info('deleteManyByIds audit', { AUDIT_RECORD });
      PROMISES.push(rulesChangesServiceV2.saveOne(context, { record: AUDIT_RECORD }));
    });
    await Promise.all(PROMISES);
  }
}

const deleteRulesConditions = async (context, datasource, rulesIds) => {
  const PROMISES = [];
  for (let ruleId of rulesIds) {
    const PARAMS = {
      ruleId
    };
    PROMISES.push(datasource.rulesConditions.deleteManyByRuleId(context, PARAMS));
  }
  await Promise.all(PROMISES);

  await runtimeDataService.deleteManyByRulesIdsFromConfigDirectoryRulesConditions(context, { ids: rulesIds });
}

const deleteManyByIds = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.rules.deleteManyByIds(context, params);
    if (!lodash.isEmpty(RET_VAL)) {
      saveAuditRecord(context, params);
    }
    const RULES_IDS = params?.ids;
    await deleteRulesConditions(context, DATASOURCE, RULES_IDS);

    await runtimeDataService.deleteManyByIdsFromConfigDirectoryRules(context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
