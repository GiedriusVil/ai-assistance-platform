/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-find-one-by-rule-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  getRulesDatasourceV2ByContext,
  getDatasourceByContext,
} = require('../datasource.utils');

const findOneByRuleId = async (context, params) => {
  let rule;
  let ruleEngagementId;
  try {
    if (
      lodash.isEmpty(params?.ruleId)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE_RULES_V2 = getRulesDatasourceV2ByContext(context);
    rule = await DATASOURCE_RULES_V2.rules.findOneById(context, { id: params?.ruleId });
    if (
      lodash.isEmpty(rule)
    ) {
      const MESSAGE = `Unable to retrieve rule by provided params.ruleId! [params.ruleId: ${params?.ruleId}`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    ruleEngagementId = rule?.engagement?.id;
    const DATASOURCE_ENGAGEMENTS_V1 = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE_ENGAGEMENTS_V1.validationEngagements.findOneById(context, { id: ruleEngagementId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByRuleId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findOneByRuleId,
}
