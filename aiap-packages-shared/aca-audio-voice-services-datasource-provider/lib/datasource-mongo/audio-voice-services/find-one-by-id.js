/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-audio-voice-services-datasource-mongo-audio-voice-services-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const ReadPreference = require('mongodb').ReadPreference;

const findOneById = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.audioVoiceServices;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  const PARAMS_ID = params?.id;

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const MESSAGE = `Missing required params.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      !validator.isMongoId(PARAMS_ID) &&
      !validator.isAlphanumeric(PARAMS_ID, 'en-US', { ignore: '$_-' })
    ) {
      const ERROR_MESSAGE = 'Invalid params.id attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: PARAMS_ID
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const RET_VAL = ramda.pathOr({}, [0], RESULT);
    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(findOneById.name, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  findOneById,
}
