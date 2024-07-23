/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-worker-pool-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');
const ramda = require('ramda');

const { setConfigurationProvider } = require('./lib/configuration');


const { AcaWorkerPoolManagerNodeJs } = require('./lib/worker-pool-manager-nodejs');

let singleton;

const getAcaWorkerPoolManager = () => {
    if (lodash.isEmpty(singleton)) {
        singleton = new AcaWorkerPoolManagerNodeJs();
    }
    return singleton;
}

const initByConfigurationProvider = async (provider) => {
    if (
      lodash.isEmpty(provider)
    ) {
      const ACA_ERROR = {
        type: 'INITIALIZATION_ERROR',
        message: `[${MODULE_ID}] Missing required configuration provider parameter!`
      };
      throw ACA_ERROR;
    }
    setConfigurationProvider(provider);
}

module.exports = {
    initByConfigurationProvider, 
    getAcaWorkerPoolManager,
}
