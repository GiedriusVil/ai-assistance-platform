/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_MIDDLEWARE_LOW_CONFIDENCE_ENABLED', false, {
    minConfidence: rawConfiguration.AIAP_MIDDLEWARE_LOW_CONFIDENCE_MIN_CONFIDENCE,
    maxRetryCount: rawConfiguration.AIAP_MIDDLEWARE_LOW_CONFIDENCE_MAX_RETRY_COUNT,
    retryMessage: rawConfiguration.AIAP_MIDDLEWARE_LOW_CONFIDENCE_RETRY_MESSAGE,
    message: rawConfiguration.AIAP_MIDDLEWARE_LOW_CONFIDENCE_DEFAULT_MESSAGE,
    skill: rawConfiguration.AIAP_MIDDLEWARE_LOW_CONFIDENCE_HANDOVER_SKILL,
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
