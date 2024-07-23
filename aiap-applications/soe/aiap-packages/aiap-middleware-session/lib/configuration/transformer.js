/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_MIDDLEWARE_SESSION_ENABLED', false, {
    type: rawConfiguration.AIAP_MIDDLEWARE_SESSION_TYPE,
    expiration: rawConfiguration.AIAP_MIDDLEWARE_SESSION_EXPIRATION,
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
