/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-service-rules-conditions-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { getCatalogRulesDatasource } = require('../datasource.utils');
const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const _findManyByQuery = async (context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    try {
        const DATASOURCE = getCatalogRulesDatasource(context);
        const RET_VAL = await DATASOURCE.rulesConditions.findManyByQuery(context, params);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(`${_findManyByQuery.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

const findManyByQuery = async (context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    try {
        const RET_VAL = await executeEnrichedByLambdaModule(MODULE_ID, _findManyByQuery, context, params);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error(`${findManyByQuery.name}`, { ACA_ERROR });
        throw ACA_ERROR;
    }
};

module.exports = {
    findManyByQuery,
}
