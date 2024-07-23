/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-service-purchase-requests-count-by-validations';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMetricsDatasourceByContext } = require('@ibm-aca/aca-metrics-datasource-provider');
const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');

const _attachRuleIDs = async (context, validations) => {

    const RULES_DATASOURCE = getAcaRulesDatasourceByContext(context);

    for (let v of validations) {
        const RULE_ID = ramda.path(['_id'], v);
        const RULE = await RULES_DATASOURCE.rules.findOneById(context, {id: RULE_ID});
        const RULE_NAME = ramda.path(['name'], RULE);
        v.name = RULE_NAME;
    }
}

const countByValidations = async (context, params) => {
    try {
        const METRICS_DATASOURCE = getAcaMetricsDatasourceByContext(context);
        const RET_VAL = await METRICS_DATASOURCE.purchaseRequests.countByValidations(context, params);
        await _attachRuleIDs(context, RET_VAL);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
    countByValidations,
}
