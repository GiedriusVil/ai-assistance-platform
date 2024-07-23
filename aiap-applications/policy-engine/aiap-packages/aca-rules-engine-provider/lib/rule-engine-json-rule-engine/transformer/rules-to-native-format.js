/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-json-rule-engine-utils-transform-rules-to-native-format';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { ruleToNativeFormat } = require('./rule-to-native-format');

const rulesToNativeFormat = (rules) => {
  try {
    const RET_VAL = {};
    if (
      !lodash.isEmpty(rules) &&
      lodash.isArray(rules)
    ) {
      for (let rule of rules) {
        let ruleName = rule?.name;
        let ruleNativeFormat = ruleToNativeFormat(rule);
        if (
          !lodash.isEmpty(ruleName) &&
          !lodash.isEmpty(ruleNativeFormat)
        ) {
          RET_VAL[ruleName] = ruleNativeFormat;
        } else {
          logger.warn('Facing issues while tranforming rules to native!', { rule, ruleNativeFormat });
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(rulesToNativeFormat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};


module.exports = {
  rulesToNativeFormat,
}
