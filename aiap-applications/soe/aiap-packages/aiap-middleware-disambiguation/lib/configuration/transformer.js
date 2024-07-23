/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_MIDDLEWARE_DISAMBIGUATION_ENABLED', false, {
    minConfidence: rawConfiguration.AIAP_MIDDLEWARE_DISAMBIGUATION_MIN_CONFIDENCE,
    maxConfidence: rawConfiguration.AIAP_MIDDLEWARE_DISAMBIGUATION_MAX_CONFIDENCE,
    maxDifference: rawConfiguration.AIAP_MIDDLEWARE_DISAMBIGUATION_MAX_DIFFERENCE,
    selectIntentMessage: rawConfiguration.AIAP_MIDDLEWARE_DISAMBIGUATION_SELECT_INTENT_MESSAGE,
    intents: rawConfiguration.AIAP_MIDDLEWARE_DISAMBIGUATION_INTENTS ?
      JSON.parse(rawConfiguration.AIAP_MIDDLEWARE_DISAMBIGUATION_INTENTS) :
      {},
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
