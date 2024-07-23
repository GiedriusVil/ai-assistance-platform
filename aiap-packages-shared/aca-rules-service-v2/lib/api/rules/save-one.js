/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const rulesChangesServiceV2 = require('../rules-changes')

const runtimeDataService = require('../runtime-data');

const saveOne = async (context, params) => {
  let ruleV2;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RULE_V2_CLONE = lodash.cloneDeep(params?.ruleV2);
    ruleV2 = params?.ruleV2;
    appendAuditInfo(context, ruleV2);
    const RET_VAL = await DATASOURCE.rules.saveOne(context, params);

    if (RET_VAL) {
      const AUDIT_RECORD = {
        action: 'SAVE',
        ruleKey: RULE_V2_CLONE?.key,
        docType: 'RULE_V2'
      }
      logger.info('saveOne audit', { AUDIT_RECORD });
      await rulesChangesServiceV2.saveOne(context, { record: AUDIT_RECORD });
    }

    await runtimeDataService.synchronizeWithConfigDirectoryRules(context, { value: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
