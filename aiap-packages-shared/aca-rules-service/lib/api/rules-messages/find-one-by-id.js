/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-messages-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
    transformToAcaErrorFormat,
} = require('@ibm-aca/aca-data-transformer');

const {
    getAcaRulesDatasourceByContext,
} = require('@ibm-aca/aca-rules-datasource-provider');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findOneById = async (context, params) => {
    const DATASOURCE = getAcaRulesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.rulesMessages.findOneById(context, params);
    return RET_VAL;
}

const findOneById = async (context, params) => {
    try {
      const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findOneById, context, params);
      return RET_VAL;
    } catch(error) {
        const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
};

module.exports = {
    findOneById,
}
