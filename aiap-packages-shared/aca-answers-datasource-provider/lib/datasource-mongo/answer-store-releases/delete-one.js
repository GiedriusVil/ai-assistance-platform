
/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'anwers-datasource-mongo-answer-store-releases-delete-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const deleteOne = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    const COLLECTION = datasource._collections.answerStoreReleases;

    const PARAMS_ID = params?.id;

    let filter;
    try {
        filter = {
            _id: PARAMS_ID
        };

        const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
        const RET_VAL = await ACA_MONGO_CLIENT
            .__deleteOne(context, {
                collection: COLLECTION,
                filter: filter
            });
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
        logger.error(deleteOne.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    deleteOne
}
