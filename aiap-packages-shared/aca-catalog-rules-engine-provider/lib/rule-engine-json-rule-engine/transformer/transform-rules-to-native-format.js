/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-engine-provider-json-rule-engine-transform-rules-to-native-format';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { transformRuleToNativeFormat } = require('./transform-rule-to-native-format');

const transformRulesToNativeFormat = (rules) => {
    const RET_VAL = {};
    if (
        !lodash.isEmpty(rules) &&
        lodash.isArray(rules)
    ) {
        for (let rule of rules) {
            let ruleName = ramda.path(['name'], rule);
            let ruleNativeFormat = transformRuleToNativeFormat(rule);
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
};


module.exports = {
    transformRulesToNativeFormat,
}
