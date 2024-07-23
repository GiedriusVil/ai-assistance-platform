/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-mongo-rules-find-latest-5-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const ReadPreference = require('mongodb').ReadPreference;

const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');
const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const findLatest5ByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  let query;
  try {
    query = params?.query;
    if (
      lodash.isEmpty(query)
    ) {
      const MESSAGE = `Missing required params.query parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__findToArrayExtended(context, {
        collection: COLLECTION,
        collectionOptions: COLLECTION_OPTIONS,
        filter: query,
        limit: 5,
        sort: { timestamp: -1 }
      });

    sanitizeIdAttribute(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findLatest5ByQuery.name, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  findLatest5ByQuery,
}
