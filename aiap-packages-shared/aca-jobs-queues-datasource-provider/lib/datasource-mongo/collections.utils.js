/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
    jobsQueues: 'jobsQueues',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {
    const COLLECTIONS_CONFIGURATION = ramda.path(['collections'], configuration);

    const JOBS_QUEUES = ramda.path(['jobsQueues'], COLLECTIONS_CONFIGURATION);

    const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
    if (
        !lodash.isEmpty(JOBS_QUEUES)
    ) {
        RET_VAL.jobsQueues = JOBS_QUEUES;
    }
    return RET_VAL;
}

module.exports = {
    sanitizedCollectionsFromConfiguration,
}
