
/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-catalogs-find-many-by-match';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');

const findManyByMatch = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    let query;
    try {
        query = aggregateQuery(params);

        const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
        const RET_VAL = await ACA_MONGO_CLIENT.
            __aggregateToArray(context, {
                collection: datasource._collections.catalogs,
                pipeline: query,
            });

        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, query });
        logger.error(findManyByMatch.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    findManyByMatch,
}
