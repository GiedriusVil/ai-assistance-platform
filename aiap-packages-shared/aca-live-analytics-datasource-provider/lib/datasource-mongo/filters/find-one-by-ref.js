/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-datasource-mongo-filters-find-one-by-ref';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const ReadPreference = require('mongodb').ReadPreference;

const findOneByRef = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.filters;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };

  const PARAMS_REF = params?.ref;

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_REF)
    ) {
      const MESSAGE = `Missing required params.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    filter = {
      ref: PARAMS_REF
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
    logger.error(findOneByRef.name, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  findOneByRef,
}
