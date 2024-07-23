/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/


const transformProxy = async (rawConfiguration) => {
    const RET_VAL =     {
        analytics: {
            aggregated: {
                url: rawConfiguration.AGGREGATED_ANALYTICS_API_URL,
                basePath: rawConfiguration.AGGREGATED_ANALYTICS_BASE_PATH,
                apiKey: rawConfiguration.AGGREGATED_ANALYTICS_API_KEY,
                apiSecret: rawConfiguration.AGGREGATED_ANALYTICS_API_SECRET,
                tenantId: rawConfiguration.AGGREGATED_ANALYTICS_TENANT_ID,
            },
        },
    };
    return RET_VAL;
}

module.exports = {
    transformProxy
}