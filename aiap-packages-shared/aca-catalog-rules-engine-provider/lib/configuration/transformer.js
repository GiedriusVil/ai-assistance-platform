/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const jsonRuleEngine = (rawConfiguration) => {
    let retVal = false;
    const IS_ENABLED = rawConfiguration.CATALOG_RULES_ENGINE_PROVIDER_TYPE === 'jsonRuleEngine';
    if (IS_ENABLED) {
        retVal = {
            allowUndefinedFacts: rawConfiguration.CATALOG_RULES_ENGINE_PROVIDER_JSON_RULE_ENGINE_ALLOW_UNDEFINED_FACTS,
        }
    }
    return retVal;
};

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('CATALOG_RULES_ENGINE_PROVIDER_ENABLED', false, {
        jsonRuleEngine: jsonRuleEngine(rawConfiguration)
    });
    return RET_VAL;
};

module.exports = {
    transformRawConfiguration
}
