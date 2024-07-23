/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-service-rules-external-suppliers-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { formatResponse } = require('./format-response');

const _findManyByQuery = async (context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    const TMP_SUPPLIERS = require('../../../../data/response-suppliers.json');
    try {
        const SUPPLIERS = TMP_SUPPLIERS?.items;
        const TOTAL = SUPPLIERS.length;
        const RET_VAL = {
            items: formatResponse(SUPPLIERS),
            total: TOTAL
        };
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
