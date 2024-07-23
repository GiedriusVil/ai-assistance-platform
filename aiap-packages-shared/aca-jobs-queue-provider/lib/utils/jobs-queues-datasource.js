/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-jobs-queues-utils-datasource`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getAcaJobsQueuesDatasourceByTenant } = require('@ibm-aca/aca-jobs-queues-datasource-provider');


const getJobsQueuesDatasourceByTenant = (tenant) => {
    try {
        const RET_VAL = getAcaJobsQueuesDatasourceByTenant(tenant);
        if (
            lodash.isEmpty(RET_VAL)
        ) {
            const MESSAGE = 'Unable retrieve jobs queues datasource by tenant!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, {
                tenant: {
                    id: ramda.path(['id'], tenant),
                    hash: ramda.path(['hash'], tenant),
                }
            });
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    getJobsQueuesDatasourceByTenant,
}
