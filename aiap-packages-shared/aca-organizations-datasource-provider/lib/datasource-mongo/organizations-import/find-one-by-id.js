/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo-organizations-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');
const ReadPreference = require('mongodb').ReadPreference;

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');
const { getOrganizationsImportCollectionName } = require('../../utils');

const findOneById = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = getOrganizationsImportCollectionName(context);
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  const PARAMS_ID = params?.id;
  let query;
  try {
    if (lodash.isEmpty(PARAMS_ID)) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !validator.isMongoId(PARAMS_ID) &&
      !validator.isAlphanumeric(PARAMS_ID, 'en-US', { ignore: '_-' })
    ) {
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Invalid params.id attribute!');
    }
    query = {
      _id: PARAMS_ID
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__findOne(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: query,
      });
    sanitizeIdAttribute(RET_VAL);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${findOneById.name}`, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  findOneById,
}
