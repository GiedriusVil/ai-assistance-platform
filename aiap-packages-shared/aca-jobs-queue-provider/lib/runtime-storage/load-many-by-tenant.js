/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = `aca-jobs-queues-runtime-storage-load-many-by-tenant`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
    getJobsQueuesDatasourceByTenant,
} = require('../utils');

const loadManyByTenant = async (params, skipExceptions = false) => {
    const TENANT = ramda.path(['tenant'], params);
    try {
        if (
            lodash.isEmpty(TENANT)
        ) {
            const MESSAGE = 'Missing required params.tenant parameter!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        const DATASOURCE = getJobsQueuesDatasourceByTenant(TENANT);
        const PARAMS = {
            sort: {
                field: 'id',
                direction: 'asc'
            }
        };
        const RESPONSE = await DATASOURCE.jobsQueues.findManyByQuery({}, PARAMS);
        const QUEUES_DEFS = ramda.path(['items'], RESPONSE);
        return QUEUES_DEFS;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        ACA_ERROR.tenant = {
            id: ramda.path(['id'], TENANT),
            hash: ramda.path(['hash'], TENANT),
        }
        logger.error('->', { ACA_ERROR });
        if (
            !skipExceptions
        ) {
            throw ACA_ERROR;
        }
    }
}

module.exports = {
    loadManyByTenant,
}
