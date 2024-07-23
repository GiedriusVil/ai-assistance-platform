/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('ramda');

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const RET_VAL = provider.isEnabled('WORKER_POOL_MANAGER_PROVIDER_ENABLED', false, {
        quantityOfWorkers: rawConfiguration.WORKER_POOL_MANAGER_PROVIDER_QUANTITY_OF_WORKERS
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
