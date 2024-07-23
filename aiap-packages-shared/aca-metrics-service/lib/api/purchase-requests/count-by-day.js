/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-service-purchase-requests-count-by-day';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMetricsDatasourceByContext } = require('@ibm-aca/aca-metrics-datasource-provider');

const countByDay = async (context, params) => {
    try {
        const DATASOURCE = getAcaMetricsDatasourceByContext(context);
        const RET_VAL = await DATASOURCE.purchaseRequests.countByDay(context, params);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
    countByDay,
}
