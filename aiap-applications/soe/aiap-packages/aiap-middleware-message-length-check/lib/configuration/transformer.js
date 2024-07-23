/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_MIDDLEWARE_MESSAGE_LENGTH_CHECK_ENABLED', false, {
    id: rawConfiguration.AIAP_MIDDLEWARE_MESSAGE_LENGTH_CHECK_FAIL_ID,
    maxLength: rawConfiguration.AIAP_MIDDLEWARE_MESSAGE_LENGTH_CHECK_MAX_LENGTH,
    maxRetryCount: rawConfiguration.AIAP_MIDDLEWARE_MESSAGE_LENGTH_CHECK_MAX_RETRY_COUNT,
    retryMessage: rawConfiguration.AIAP_MIDDLEWARE_MESSAGE_LENGTH_CHECK_RETRY_MESSAGE,
    message: rawConfiguration.AIAP_MIDDLEWARE_MESSAGE_LENGTH_CHECK_DEFAULT_MESSAGE,
    skill: rawConfiguration.AIAP_MIDDLEWARE_MESSAGE_LENGTH_CHECK_HANDOVER_SKILL,
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
