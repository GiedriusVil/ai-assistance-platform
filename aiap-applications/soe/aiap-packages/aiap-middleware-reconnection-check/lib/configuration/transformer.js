/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_MIDDLEWARE_RECONNECTION_CHECK_ENABLED', false, {
    notification: provider.isEnabled('AIAP_MIDDLEWARE_RECONNECTION_CHECK_NOTIFICATION', true),
    message: rawConfiguration.AIAP_MIDDLEWARE_RECONNECTION_CHECK_MESSAGE,
  })
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
