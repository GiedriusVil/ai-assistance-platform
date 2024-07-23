/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-provider-conversations-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregatePipeline } = require('./aggregate-pipeline');

const findManyByConversationsIds = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;

  let query;
  try {
    query = aggregatePipeline(datasource, context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });

    const RESULT = RESPONSE?.[0];
    const RESULT_MESSAGES = RESULT?.messages ?? [];
    const RESULT_TOTAL = RESULT?.total ?? 0;

    const TOTAL_CONVERSATIONS = ramda.pathOr(RESULT_MESSAGES.length, [0, 'count'], RESULT_TOTAL);
    const RET_VAL = {
      messages: RESULT_MESSAGES,
      total: TOTAL_CONVERSATIONS
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findManyByConversationsIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findManyByConversationsIds,
}
