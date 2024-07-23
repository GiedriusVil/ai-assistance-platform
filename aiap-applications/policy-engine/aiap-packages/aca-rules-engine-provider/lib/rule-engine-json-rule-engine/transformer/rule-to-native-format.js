/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rule-engine-provider-rule-engine-json-rule-engine-transform-rule-to-native-format';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const _addGroupTypeCondition = (rule, ruleType, groupType) => {
  const conditions = rule?.conditions?.all;
  if (
    ruleType == 'GROUP' &&
    !lodash.isEmpty(conditions) &&
    lodash.isArray(conditions)
  ) {
    const groupNameCondition = conditions?.find(el => !lodash.isEmpty(el?.any) && lodash.isArray(el?.any));
    if (
      lodash.isEmpty(groupNameCondition)
    ) {
      conditions.push({
        any: [{
          fact: 'group',
          path: '$.group.name',
          operator: 'equal',
          value: groupType,
        }],
      });
    } else {
      groupNameCondition?.any?.push({
        fact: 'group',
        path: '$.group.name',
        operator: 'equal',
        value: groupType,
      });
    }
  }
};

const ruleToNativeFormat = (rule) => {
  let ruleId = rule?.id;
  let ruleName = rule?.name;
  let ruleKey = rule?.key;
  let ruleType = rule?.type;
  let ruleFilters = rule?.filters;
  let ruleConditions = rule?.conditions;
  let ruleActions = rule?.actions;
  try {
    const RET_VAL = {
      id: ruleId,
      key: !lodash.isEmpty(ruleKey) ? ruleKey : ruleName,
      name: ruleName,
      conditions: {
        all: [{
          fact: 'type',
          operator: 'equal',
          value: ruleType,
        }],
      },
      event: {
        type: 'event',
        params: {
          ruleType: ruleType,
          ruleId: ruleId,
          rule: rule,
          actions: ruleActions
        }
      }
    };
    const TMP_RULE_CONDITIONS = RET_VAL?.conditions?.all;
    ruleConditions.forEach((condition) => {
      if (
        !lodash.isEmpty(condition)
      ) {
        const FACT_VALUE = ruleType == 'ITEM' ? 'item' :
          ruleType == 'GROUP' ? 'group' : condition.rootElement;

        const VALUE = condition.valAsString ? condition.valAsString :
          condition.valAsNumber ? condition.valAsNumber :
            condition.valAsArray ? condition.valAsArray : '';

        TMP_RULE_CONDITIONS.push({
          fact: FACT_VALUE,
          path: condition.path,
          operator: condition.type,
          value: VALUE
        });
      }
      const GROUP_TYPE = condition?.rootElement;
      _addGroupTypeCondition(RET_VAL, ruleType, GROUP_TYPE);
    });
    if (
      !lodash.isEmpty(ruleFilters)
    ) {
      ruleFilters.forEach(filter => {
        const FILTER_OPERATOR = filter?.operator;
        const FILTER_PATH = filter?.path;
        const FILTER_VALUE = filter?.value;

        const FACT_VALUE = ruleType == 'ITEM' ? 'item' :
          ruleType == 'GROUP' ? 'group' : filter.rootElement;

        if (
          FILTER_VALUE != 'ANY'
        ) {
          TMP_RULE_CONDITIONS.push({
            fact: FACT_VALUE,
            path: FILTER_PATH,
            operator: FILTER_OPERATOR ? FILTER_OPERATOR : 'equal',
            value: FILTER_VALUE,
          });
        }
      });
    }
    return RET_VAL;
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
