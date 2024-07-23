/*
	© Copyright IBM Corporation 2024. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('MIDDLEWARE_CONVERSATION_TONE_ENABLED', false, {});
    return RET_VAL;
}

export {
    transformRawConfiguration,
}
