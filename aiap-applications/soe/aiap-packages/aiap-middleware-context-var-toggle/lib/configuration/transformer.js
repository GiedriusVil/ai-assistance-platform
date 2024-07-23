/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('AIAP_MIDDLEWARE_CONTEXT_VAR_TOGGLE_ENABLED', false, {
    confidenceLevel: rawConfiguration.AIAP_MIDDLEWARE_CONTEXT_VAR_TOGGLE_CONFIDENCE_LEVEL || 0.5,
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
