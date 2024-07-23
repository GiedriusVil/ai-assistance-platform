/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-jobs-queues-service-datasource-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { transformContextForLogger } = require('@ibm-aca/aca-data-transformer');

const { getAcaJobsQueuesDatasourceByContext } = require('@ibm-aca/aca-jobs-queues-datasource-provider');

const getDatasourceByContext = (context) => {
    try {
        const RET_VAL = getAcaJobsQueuesDatasourceByContext(context);
        if (
            lodash.isEmpty(RET_VAL)
        ) {
            const MESSAGE = 'Unable to retrieve jobsQueues datasource!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
        }
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', { error: error });
        throw ACA_ERROR;
    }
}

module.exports = {
    getDatasourceByContext,
}
