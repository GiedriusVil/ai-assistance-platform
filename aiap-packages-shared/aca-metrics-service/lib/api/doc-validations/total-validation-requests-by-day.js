/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-service-doc-validations-total-validation-requests-by-day';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMetricsDatasourceByContext } = require('@ibm-aca/aca-metrics-datasource-provider');

const totalValidationRequestsByDay = async (context, params) => {
    try {
        const DATASOURCE = getAcaMetricsDatasourceByContext(context);
        const RET_VAL = await DATASOURCE.docValidations.totalValidationRequestsByDay(context, params);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${totalValidationRequestsByDay.name}`, {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
  totalValidationRequestsByDay,
}
