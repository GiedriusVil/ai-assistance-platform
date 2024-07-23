/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-service-catalogs-find-all-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const findManyByQuery = async (context, params) => {
    try {
        const DATASOURCE = getDatasourceByContext(context);
        const RET_VAL = await DATASOURCE.jobsQueues.findManyByQuery(context, params);
        return { items: RET_VAL };
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    findManyByQuery,
}
