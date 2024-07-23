/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-mongo-rules-find-many-by-ai-change-request-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const ReadPreference = require('mongodb').ReadPreference;

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const findManyByAiChangeRequestIds = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;
  const COLLECTION_OPTIONS = { readPreference: ReadPreference.SECONDARY_PREFERRED };
  const PARAMS_IDS = params?.ids;
  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    ids = PARAMS_IDS;
    filter = {
      'aiChangeRequest.id': {
        $in: ids
      }
    };
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
    .__findToArray(context, {
      collection: COLLECTION,
      collectionOptions: COLLECTION_OPTIONS,
      filter: filter,
    });

    RET_VAL?.forEach(utterance => {
      sanitizeIdAttribute(utterance)
    })
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(`${findManyByAiChangeRequestIds.name}`, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  findManyByAiChangeRequestIds,
}
