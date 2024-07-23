/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-service-purchase-requests-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMetricsDatasourceByContext } = require('@ibm-aca/aca-metrics-datasource-provider');

const findOneById = async (context, params) => {
    try {
        const DATASOURCE = getAcaMetricsDatasourceByContext(context);
        const RET_VAL = await DATASOURCE.purchaseRequests.findOneById(context, params);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
    findOneById,
}
