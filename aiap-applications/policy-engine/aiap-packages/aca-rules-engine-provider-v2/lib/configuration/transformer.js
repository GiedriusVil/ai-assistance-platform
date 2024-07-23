/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const jsonRuleEngine = (rawConfiguration) => {
  let retVal = false;
  const IS_ENABLED = rawConfiguration.RULES_ENGINE_PROVIDER_V2_TYPE === 'jsonRuleEngine';
  if (
    IS_ENABLED
  ) {
    retVal = {
      allowUndefinedFacts: rawConfiguration.RULES_ENGINE_PROVIDER_V2_JSON_RULE_ENGINE_ALLOW_UNDEFINED_FACTS,
    }
  }
  return retVal;
};

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('RULES_ENGINE_PROVIDER_V2_ENABLED', false, {
    jsonRuleEngine: jsonRuleEngine(rawConfiguration)
  });
  return RET_VAL;
};

module.exports = {
  transformRawConfiguration,
}
