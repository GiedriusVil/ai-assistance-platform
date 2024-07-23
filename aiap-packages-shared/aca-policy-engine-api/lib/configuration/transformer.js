/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/


const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('POLICY_ENGINE_API_ENABLED', false, {
        client: {
            hostname: rawConfiguration.POLICY_ENGINE_API_HOSTNAME, 
        }
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
