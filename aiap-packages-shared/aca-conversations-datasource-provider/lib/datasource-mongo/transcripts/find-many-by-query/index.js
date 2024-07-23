/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-provider-transcripts-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { formatResponse } = require('./format-response');
const { aggregateQuery } = require('./aggregate-query');

const findManyByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.conversations;

  let query;
  try {
    if (lodash.isEmpty(params)) {
      logger.warn('Passed params are empty. Will do my best!', { params });
    }
    query = aggregateQuery(datasource, context, params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
        options: params?.options,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const CONVERSATIONS = ramda.pathOr([], ['conversations'], RESULT);
    const TOTAL = ramda.pathOr({}, ['total'], RESULT);
    const RET_VAL = {
      items: formatResponse(CONVERSATIONS),
      total: ramda.pathOr(CONVERSATIONS.length, [0, 'count'], TOTAL)
    };
    return RET_VAL;
  }
  catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findManyByQuery,
}
