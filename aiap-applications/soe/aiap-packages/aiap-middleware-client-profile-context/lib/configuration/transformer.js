/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_MIDDLEWARE_CLIENT_PROFILE_CONTEXT_ENABLED', false, {
    filters: rawConfiguration.AIAP_MIDDLEWARE_CLIENT_PROFILE_CONTEXT_FILTERS
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
