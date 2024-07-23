/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-datasource-provider-tiles-models-changes-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const ReadPreference = require('mongodb').ReadPreference;

const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const findOneById = async (datasource, context, params) => {
    const CONTEXT_USER_ID = context?.user?.id;
    const COLLECTION = datasource._collections.tilesChanges;

    let filter;
    try {
        const ID = params?.id;
        if (
            lodash.isEmpty(ID)
        ) {
            const MESSAGE = `Missing required params.id attribute!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
        }
        if (
            !validator.isMongoId(ID) &&
            !validator.isAlphanumeric(ID, 'en-US', { ignore: '$_-' })
        ) {
            const ERROR_MESSAGE = 'Invalid params.id attribute!';
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
        }
        const COLLECTION_OPTIONS = {
            readPreference: ReadPreference.SECONDARY_PREFERRED
        }
        filter = {
            _id: ID
        };

        const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
        const RESPONSE = await ACA_MONGO_CLIENT
            .__findToArray(context, {
                collection: COLLECTION,
                collectionOptions: COLLECTION_OPTIONS,
                filter: filter,
            });

        const RET_VAL = ramda.pathOr({}, [0], RESPONSE);
        sanitizeIdAttribute(RET_VAL);
        return RET_VAL;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
        logger.error(findOneById.name, { ACA_ERROR });
        throw ACA_ERROR;
    }
}

module.exports = {
    findOneById
}