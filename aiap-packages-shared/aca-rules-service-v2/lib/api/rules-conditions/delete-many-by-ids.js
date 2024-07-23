/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-conditions-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const runtimeDataService = require('../runtime-data');

const deleteManyByIds = async (context, params) => {
  let firstConditionId;
  let firstCondition;
  let rule;
  let ruleId;
  let ruleEngagementKey;
  let channel;

  try {
    const DATASOURCE = getDatasourceByContext(context);

    firstConditionId = ramda.path(['ids', 0], params);
    if (
      !lodash.isEmpty(firstConditionId)
    ) {
      firstCondition = await DATASOURCE.rulesConditions.findOneById(context, { id: firstConditionId });
      rule = await DATASOURCE.rules.findOneById(context, { id: firstCondition?.ruleId });
      ruleId = rule?.id;
      ruleEngagementKey = rule?.engagement?.key;
      channel = `${AIAP_EVENT_TYPE.RESET_RULES_ENGINE_V2}:${ruleEngagementKey}`;
    }
    const RET_VAL = await DATASOURCE.rulesConditions.deleteManyByIds(context, params);
    if (
      !lodash.isEmpty(channel)
    ) {
      getEventStreamByContext(context).publish(channel, { rule });
      logger.info(`Published event to channel -> ${channel}!`);
    }

    await runtimeDataService.deleteManyByIdsFromConfigDirectoryRulesConditions(context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { ruleId, ruleEngagementKey, firstConditionId });
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
