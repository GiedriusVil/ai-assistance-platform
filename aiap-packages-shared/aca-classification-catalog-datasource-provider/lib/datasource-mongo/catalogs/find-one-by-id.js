/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-catalogs-find-one-by-id';
const LOGGER = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const validator = require('validator');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const ReadPreference = require('mongodb').ReadPreference;
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const findOneById = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  const PARAMS_ID = params?.id;
  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
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
      _id: {
        $eq: PARAMS_ID
      }
    }
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const OBJECTS = await ACA_MONGO_CLIENT
      .__findToArray(context, {
        collection: datasource._collections.catalogs,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });

    const OBJECT = ramda.path([0], OBJECTS);
    sanitizeIdAttribute(OBJECT);
    const RET_VAL = OBJECT;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    LOGGER.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneById,
}
