/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-app-datasource-feedbacks-delete-one-by-message-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const ReadPreference = require('mongodb').ReadPreference;

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const deleteOneByMessageId = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;

    const COLLECTION = datasource._collections.feedbacks;
    const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

    let filter;
    try {
        const MESSAGE_ID = ramda.path(['messageId'], params);
        filter = {
            messageId: MESSAGE_ID
        }
        const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
        const RET_VAL = await ACA_MONGO_CLIENT
            .__deleteOne(context, {
                collection: COLLECTION,
                collectionOptions: COLLECTION_OPTIONS,
                filter: filter
            });
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, params });
        logger.error(deleteOneByMessageId.name, { ACA_ERROR });
        throw ACA_ERROR; 
    }
}

module.exports = {
    deleteOneByMessageId
} 
