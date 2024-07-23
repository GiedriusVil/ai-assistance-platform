/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-service-rules-import-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
    getAcaRulesDatasourceByContext,
} = require('@ibm-aca/aca-rules-datasource-provider');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _deleteOneById = async (context, params) => {
  const DATASOURCE = getAcaRulesDatasourceByContext(context);
  const RET_VAL = await DATASOURCE.rulesImport.deleteOneById(context, params);
  return RET_VAL;
}

const deleteOneById = async (context, params) => {
    try {
        const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _deleteOneById, context, params);
        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
};

module.exports = {
    deleteOneById,
}
