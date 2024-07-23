/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('MIDDLEWARE_CONVERSATION_TONE_ENABLED', false, {
        minUtterances: rawConfiguration.MIDDLEWARE_CONVERSATION_TONE_MIN_UTTERANCES,
        inactivityTimeout: rawConfiguration.MIDDLEWARE_CONVERSATION_TONE_INACTIVITY_TIMEOUT,
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
