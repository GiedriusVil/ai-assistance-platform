/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const transformRawConfiguration = async (rawConfiguration, provider) => {
    let maxWorkersCount;
    try {
        maxWorkersCount = parseInt(rawConfiguration.TEST_WORKER_PROVIDER_MAX_WORKERS_COUNT);
    } catch (error) {
        console.log('aca-test-worker-provider:transformRawConfiguration', error);
        
    }
    const RET_VAL = provider.isEnabled('TEST_WORKER_PROVIDER_ENABLED', false, {
        maxWorkersCount: maxWorkersCount || 10,
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
