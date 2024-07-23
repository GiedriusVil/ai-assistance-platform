/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-catalog-rules-service-rules-external-catalogs-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { executeEnrichedByLambdaModule } = require('@ibm-aca/aca-lambda-modules-executor');

const { formatResponse } = require('../find-many-by-query/format-response');

const _findManyByQuery = async (context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    const TMP_CATALOGS = require('../../../../data/response-catalogs.json');
    try {
        const CATALOGS = TMP_CATALOGS?.items;
        const TOTAL = CATALOGS.length;
        const RET_VAL = {
            items: formatResponse(CATALOGS),
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
