/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-service-rules-suppliers-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getBuyRulesDatasource } = require('../datasource.utils');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findOneById = async (context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    try {
        const DATASOURCE = getBuyRulesDatasource(context);
        const RET_VAL = await DATASOURCE.rulesSuppliers.findOneById(context, params);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(`${_findOneById.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const findOneById = async (context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    try {
        const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findOneById, context, params);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(`${findOneById.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
};

module.exports = {
    findOneById,
}
