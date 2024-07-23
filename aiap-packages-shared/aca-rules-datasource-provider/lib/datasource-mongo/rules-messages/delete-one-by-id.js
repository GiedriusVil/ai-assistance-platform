/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-mongo-messages-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');
const ReadPreference = require('mongodb').ReadPreference;

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getMessageImportCollectionName } = require('../../utils');

const deleteOneById = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const IS_IMPORT = ramda.pathOr(false, ['isImport'], params);
  const COLLECTION = IS_IMPORT ? getMessageImportCollectionName(context) : datasource._collections.rulesMessages;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.PRIMARY };
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
      !validator.isAlphanumeric(PARAMS_ID, 'en-US', { ignore: '_-' })
    ) {
      const VALIDATION_MESSAGE = 'Mandatory parameter id invalid!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, VALIDATION_MESSAGE);
    }
    filter = {
      _id: PARAMS_ID
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__findOneAndDelete(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: filter,
      });
    const RET_VAL = {
      id: PARAMS_ID,
      status: 'DELETED'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(`${deleteOneById.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
    deleteOneById,
}
