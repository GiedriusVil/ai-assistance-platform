/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-actions-find-one-and-modify';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const findOneAndModify = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;

    const ReadPreference = require('mongodb').ReadPreference;

    const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

    const PARAMS_FILTER = params?.filter; 
    const PARAMS_UPDATE = params?.update;
    const PARAMS_OPTIONS = params?.options
    try {
        if (
            lodash.isEmpty(PARAMS_FILTER)
        ) {
            const MESSAGE = `Missing required params.filter parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(PARAMS_UPDATE)
        ) {
            const MESSAGE = `Missing required params.update parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            lodash.isEmpty(PARAMS_OPTIONS)
        ) {
            const MESSAGE = `Missing required params.options parameter!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }

        const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
        const RET_VAL = await ACA_MONGO_CLIENT
            .__findOneAndUpdate(context, {
                collection: datasource._collections.actions,
                collectionOptions: COLLECTION_OPTIONS,
                filter: PARAMS_FILTER,
                update: PARAMS_UPDATE,
                options: PARAMS_OPTIONS,
            });

        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
        logger.error('findOneAndModify', { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    findOneAndModify
}
