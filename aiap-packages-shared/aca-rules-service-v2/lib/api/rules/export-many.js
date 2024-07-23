/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-v2-rules-export-many';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceByContext } = require('./../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const attachConditionToRule = async (context, datasource, params, rule) => {
  const RULE_KEY = rule?.key;
  const PARAMS = {
    ...params,
    ruleKey: RULE_KEY
  }
  const RESPONSE = await datasource.rulesConditions.findManyByQuery(context, PARAMS);
  const CONDITIONS = RESPONSE?.items;
  if (
    !lodash.isEmpty(CONDITIONS) &&
    lodash.isArray(CONDITIONS)
  ) {
    rule.conditions = CONDITIONS;
  }
}

const attachConditionsToRules = async (context, datasource, params, rules) => {
  if (
    !lodash.isEmpty(rules) &&
    lodash.isArray(rules)
  ) {
    const PROMISES = [];
    for (let rule of rules) {
      PROMISES.push(attachConditionToRule(context, datasource, params, rule));
    }
    await Promise.all(PROMISES);
  }
}

const exportMany = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RESULT = await DATASOURCE.rules.findManyByQuery(context, params);
    const RET_VAL = RESULT?.items;
    await attachConditionsToRules(context, DATASOURCE, params, RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(exportMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  exportMany,
}
