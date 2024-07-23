/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-service-purchase-requests-retrieve-metrics';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMetricsDatasourceByContext } = require('@ibm-aca/aca-metrics-datasource-provider');

const retrieveMetrics = async (context, params) => {
    try {
        const DATASOURCE = getAcaMetricsDatasourceByContext(context);
        const totalReceivedValidations = await DATASOURCE.purchaseRequests.totalReceivedValidations(context, params);
        const totalCompletedValidations = await DATASOURCE.purchaseRequests.totalCompletedValidations(context, params);
        const totalApprovedValidations = await DATASOURCE.purchaseRequests.totalApprovedValidations(context, params);
        const totalRejectedValidations = await DATASOURCE.purchaseRequests.totalRejectedValidations(context, params);
        const totalFailedValidations = totalReceivedValidations - totalCompletedValidations;
        const totalValidatedPRs = await DATASOURCE.purchaseRequests.totalValidatedPRs(context, params);
        const totalApprovedPRs = await DATASOURCE.purchaseRequests.totalApprovedPRs(context, params);
        const totalRejectPRs = await DATASOURCE.purchaseRequests.totalRejectedPRs(context, params);
        const uniqueBuyers = await DATASOURCE.purchaseRequests.uniqueBuyers(context, params);

        const RET_VAL = {
            totalReceivedValidations,
            totalCompletedValidations,
            totalApprovedValidations,
            totalRejectedValidations,
            totalFailedValidations,
            totalValidatedPRs: totalValidatedPRs.length,
            totalApprovedPRs: totalApprovedPRs.length,
            totalRejectPRs: totalRejectPRs.length,
            uniqueBuyers: uniqueBuyers.length,
        };
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
    retrieveMetrics,
}
