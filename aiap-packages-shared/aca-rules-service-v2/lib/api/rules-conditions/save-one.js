/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-conditions-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');
const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const runtimeDataService = require('../runtime-data');

const saveOne = async (context, params) => {
  let rule;
  let ruleId;
  let ruleEngagementKey;
  let channel;
  let condition;
  let conditionId;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const SAVE_CONDITION = params?.condition;
    appendAuditInfo(context, SAVE_CONDITION);
    condition = await DATASOURCE.rulesConditions.saveOne(context, params);
    conditionId = condition?.id;
    rule = await DATASOURCE.rules.findOneById(context, { id: condition?.ruleId });
    ruleId = rule?.id;
    ruleEngagementKey = rule?.engagement?.key
    channel = `${AIAP_EVENT_TYPE.RESET_RULES_ENGINE_V2}:${ruleEngagementKey}`;
    getEventStreamByContext(context).publish(channel, { rule, condition });
    logger.info(`Published event to channel -> ${channel}!`);
    const RET_VAL = condition;

    await runtimeDataService.synchronizeWithConfigDirectoryRulesConditions(context, { value: RET_VAL });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { ruleId, ruleEngagementKey, conditionId });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
