/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-service-doc-validations-countr-rule-frequency';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMetricsDatasourceByContext } = require('@ibm-aca/aca-metrics-datasource-provider');

const countRuleFrequency = async (context, params) => {
    try {
        const DATASOURCE = getAcaMetricsDatasourceByContext(context);

        const frequency = await DATASOURCE.docValidations.countRuleFrequency(context, params);

        const RET_VAL = frequency;
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error(`${countRuleFrequency.name}`, {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
  countRuleFrequency,
}
