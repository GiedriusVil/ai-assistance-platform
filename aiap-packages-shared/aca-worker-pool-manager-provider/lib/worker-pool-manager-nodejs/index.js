/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-worker-provider-thread-worker-node-js';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');
const { v4: uuidv4 } = require('uuid');

const { Worker } = require('worker_threads');

const { transformToAcaErrorFormat } =require('@ibm-aca/aca-data-transformer');

const { getConfiguration, Configurator } = require('../configuration');

const { AcaWorkerPoolManager } = require('../worker-pool-manager');
class AcaWorkerPoolManagerNodeJs extends AcaWorkerPoolManager {

    constructor() { 
        super();
        this.pool = {};
    }

    _getWorkerKeys() {
        const RET_VAL = Object.keys(this.pool);
        return RET_VAL;
    }

    _allowedQuantityOfWorkers() {
        const CONFIG = getConfiguration();
        const RET_VAL = ramda.path([Configurator.NAME, 'quantityOfWorkers'], CONFIG);
        return RET_VAL;
    }

    _hasAvailableWorker() {
        let retVal = false;
        const WORKER_KEYS = this._getWorkerKeys();
        const ALLOWED_QUANTITY_OF_WORKERS = this._allowedQuantityOfWorkers();
        if(
            lodash.isArray(WORKER_KEYS) && 
            WORKER_KEYS.length < ALLOWED_QUANTITY_OF_WORKERS
        ) {
            retVal = true;
        }
        return retVal;
    }

    execute(job, context, params) {
        if (lodash.isEmpty(job)) {
            const ACA_ERROR = {
                type: 'VALIDATION_ERROR', 
                message: `[${MODULE_ID}] [execute] Missing required job paramater!`, 
            };
            throw ACA_ERROR;
        }
        if (
            !this._hasAvailableWorker()
        ) {
            const ALLOWED_QUANTITY_OF_WORKERS = this._allowedQuantityOfWorkers();
            const ACA_ERROR = {
                type: 'WORKER_POOL_IS_FULL_ERROR', 
                message: `[${MODULE_ID}] Worker pool is full.`, 
                allowedQuantityOfWorkers: ALLOWED_QUANTITY_OF_WORKERS, 
                workers: this._getWorkerKeys(),
            };
            throw ACA_ERROR;
        }
        const RET_VAL = new Promise((resolve, reject) => {
            const WORKER_DATA = {
                context: context, 
                params: params,
            };
            const RUNTIME_WORKER = new Worker(`./aiap-applications/tenant-customizer/packages/workers/${job}`, { workerData: WORKER_DATA });
            const RUNTIME_WORKER_ID = uuidv4();
            this.pool[RUNTIME_WORKER_ID] = RUNTIME_WORKER;
            const WORKER_MESSAGES = [];
            const WORKER_ERRORS = [];
            RUNTIME_WORKER.on('message', (message) => {
                WORKER_MESSAGES.push(message);
            });
            RUNTIME_WORKER.on('error', (error) => {
                const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
                WORKER_ERRORS.push(ACA_ERROR);
            });
            RUNTIME_WORKER.on('exit', (code) => {
                console.log('before ->', {this_pool: this.pool});
                console.log('before ->', {RUNTIME_WORKER_ID: RUNTIME_WORKER_ID});
                delete this.pool[RUNTIME_WORKER_ID];
                console.log('after ->', {this_pool: this.pool});
                console.log('after ->', {RUNTIME_WORKER_ID: RUNTIME_WORKER_ID});
                if (code === 0) {
                    logger.info('ON_EXIT_CODE_0 ->', {WORKER_MESSAGES});
                    resolve(WORKER_MESSAGES);
                } else {
                    const ACA_ERROR = {
                        type: 'SYSTEM_ERROR', 
                        message: `[${MODULE_ID}] Worker stopped with exit code ${code}.`, 
                        errors: WORKER_ERRORS
                    }
                    logger.error('ON_EXIT_ERROR ->', {ACA_ERROR});
                    reject(ACA_ERROR);
                }
            });
        });
        return RET_VAL;
    }
}

module.exports = {
    AcaWorkerPoolManagerNodeJs
};
