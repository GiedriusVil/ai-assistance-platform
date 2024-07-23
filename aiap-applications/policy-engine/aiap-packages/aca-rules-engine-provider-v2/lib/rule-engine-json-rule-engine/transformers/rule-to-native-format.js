/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rule-engine-provider-v2-rule-engine-json-rule-engine-transformers-rule-to-native-format';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const ruleToNativeFormat = (context, params) => {
  let rule;
  let ruleId;
  let ruleKey;
  let ruleName;
  let ruleConditions;

  let nativeRuleConditions;
  let retVal;
  try {
    rule = lodash.cloneDeep(params?.rule);
    ruleId = params?.rule?.id;
    ruleKey = params?.rule?.key;
    ruleName = params?.rule?.name;
    ruleConditions = params?.rule?.conditions;
    retVal = {
      id: ruleId,
      key: ruleKey,
      name: ruleName,
      conditions: { all: [] },
      event: {
        type: 'event',
        rule: rule,
      }
    };
    nativeRuleConditions = retVal?.conditions?.all;
    if (
      !lodash.isEmpty(ruleConditions) &&
      lodash.isArray(ruleConditions)
    ) {
      ruleConditions.forEach((condition) => {
        if (
          !lodash.isEmpty(condition)
        ) {
          nativeRuleConditions.push({
            id: condition?.id,
            fact: 'document',
            path: condition?.path?.value,
            operator: condition?.operator?.type,
            value: condition?.value,
          });
        }
      });
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { ruleId, ruleKey, ruleName });
    logger.error(ruleToNativeFormat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  ruleToNativeFormat,
}
