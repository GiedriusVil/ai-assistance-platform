/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('MIDDLEWARE_DELAY_ENABLED', true, {
        responseFirstDelay: rawConfiguration.MIDDLEWARE_DELAY_RESPONSE_FIRST_DELAY || 6000,
        responseSubsequentDelay: rawConfiguration.MIDDLEWARE_DELAY_RESPONSE_SUBSEQUENT_DELAY || 1000,
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration
}
