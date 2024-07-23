/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-v2-rule-engine-json-rule-engine-transformers-rules-to-native-format';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { ruleToNativeFormat } = require('./rule-to-native-format');

const rulesToNativeFormat = (context, params) => {
  let rules;
  const RET_VAL = {};
  try {
    rules = params?.rules;
    if (
      !lodash.isEmpty(rules) &&
      lodash.isArray(rules)
    ) {
      for (let rule of rules) {
        if (
          lodash.isEmpty(rule?.id)
        ) {
          const ERROR_MESSAGE = `Missing required rule.id attribute!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
        }
        if (
          lodash.isEmpty(rule?.key)
        ) {
          const ERROR_MESSAGE = `Missing required rule.key attribute!`;
          throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
        }
        let key = `${rule?.id}:${rule?.key}`;
        let ruleNativeFormat = ruleToNativeFormat(context, { rule });
        if (
          !lodash.isEmpty(key) &&
          !lodash.isEmpty(ruleNativeFormat)
        ) {
          RET_VAL[key] = ruleNativeFormat;
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
