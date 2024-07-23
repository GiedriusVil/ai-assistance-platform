/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('lodash');
const ramda = require('ramda');


const __ensureRepeatExists = (queue) => {
    const REPEAT = ramda.path(['defaultJob', 'options', 'repeat'], queue);
    if (
        lodash.isEmpty(REPEAT)
    ) {
        queue.defaultJob.options.repeat = {};
    }
}

const queue = (flatQueue) => {
    const RET_VAL = {
        tenantId: ramda.path(['tenantId'], flatQueue),
        name: ramda.path(['name'], flatQueue),
        type: ramda.path(['type'], flatQueue), 
        client: ramda.path(['client'], flatQueue),
    }
    const DEFAULT_JOB_ENABLED = ramda.path(['defaultJobEnabled'], flatQueue);

    if (DEFAULT_JOB_ENABLED === 'true') {
        const DEFAULT_JOB_LAMBDA_MODULE = ramda.path(['defaultJobLambdaModule'], flatQueue);
        const DEFAULT_JOB_REMOVE_ON_COMPLETE = parseInt(ramda.path(['defaultJobRemoveOnComplete'], flatQueue));
        const DEFAULT_JOB_RETRY_PERIOD = parseInt(ramda.path(['defaultJobRetryPeriod'], flatQueue));
        const DEFAULT_JOB_RETRY_LIMIT = parseInt(ramda.path(['defaultJobRetryLimit'], flatQueue));
        const DEFAULT_JOB_RETRY_CRON = ramda.path(['defaultJobRetryCron'], flatQueue);
        RET_VAL.defaultJob = {
            lambdaModule: DEFAULT_JOB_LAMBDA_MODULE,
            options: {}
        };
        if (
            lodash.isNumber(DEFAULT_JOB_REMOVE_ON_COMPLETE) && 
            DEFAULT_JOB_REMOVE_ON_COMPLETE > 0
        ) {
            RET_VAL.defaultJob.options.removeOnComplete = DEFAULT_JOB_REMOVE_ON_COMPLETE;
        }
        if (
            lodash.isNumber(DEFAULT_JOB_RETRY_PERIOD) && 
            DEFAULT_JOB_RETRY_PERIOD > 0
        ) {
            __ensureRepeatExists(RET_VAL);
            RET_VAL.defaultJob.options.repeat.every = DEFAULT_JOB_RETRY_PERIOD;
        }
        if (
            lodash.isNumber(DEFAULT_JOB_RETRY_LIMIT) && 
            DEFAULT_JOB_RETRY_LIMIT > 0
        ) {
            __ensureRepeatExists(RET_VAL);
            RET_VAL.defaultJob.options.repeat.limit = DEFAULT_JOB_RETRY_LIMIT;
        }
        if (
            !lodash.isEmpty(DEFAULT_JOB_RETRY_CRON)
        ) {
            __ensureRepeatExists(RET_VAL);
            RET_VAL.defaultJob.options.repeat.cron = DEFAULT_JOB_RETRY_CRON;
        }
    } 
    return RET_VAL;
}

const queues = (flatQueues) => {
    const RET_VAL = [];
    if (!lodash.isEmpty(flatQueues)) {
        for(let flatQueue of flatQueues){
            let tmpQueue = queue(flatQueue);
            if (!lodash.isEmpty(tmpQueue)) {
                RET_VAL.push(tmpQueue);
            }
        }
    }
    return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
    const QUEUES_FLAT = provider.getKeys(
        'JOBS_QUEUE_PROVIDER_QUEUE', 
        [   
            'TENANT_ID', 
            'NAME', 
            'TYPE',
            'CLIENT',
            'DEFAULT_JOB_ENABLED', 
            'DEFAULT_JOB_LAMBDA_MODULE',
            'DEFAULT_JOB_REMOVE_ON_COMPLETE',
            'DEFAULT_JOB_RETRY_PERIOD', 
            'DEFAULT_JOB_RETRY_LIMIT', 
            'DEFAULT_JOB_RETRY_CRON'
        ]
    );
    const RET_VAL = provider.isEnabled('JOBS_QUEUE_PROVIDER_ENABLED', false, {
        queues: queues(QUEUES_FLAT)
    });
    return RET_VAL;
}

module.exports = {
    transformRawConfiguration,
}
