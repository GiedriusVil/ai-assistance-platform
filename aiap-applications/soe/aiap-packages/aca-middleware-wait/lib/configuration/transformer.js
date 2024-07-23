/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const transformRawConfiguration = async (rawConfiguration, provider) => {
  const RET_VAL = provider.isEnabled('MIDDLEWARE_WAIT_ENABLED', true, {
    concatDelay: rawConfiguration.MIDDLEWARE_WAIT_CONCAT_DELAY || 250,
    maxTypingCount: rawConfiguration.MIDDLEWARE_WAIT_MAX_TYPING_COUNT || 5,
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration
}
