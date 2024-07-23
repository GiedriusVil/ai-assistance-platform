/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'ai-search-and-analysis-services-datasource-mongo-ai-search-and-analysis-services-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');
const { formatResponse } = require('./format-response');

const findManyByQuery = async (datasource, context, params) => {
  const USER_ID = ramda.path(['user', 'id'], context);
  const COLLECTION = datasource._collections.aiSearchAndAnalysisServices;

  let query;
  try {
    query = aggregateQuery(context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const AI_SEARCH_AND_ANALYSIS_SERVICES = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(AI_SEARCH_AND_ANALYSIS_SERVICES.length, ['total'], RESULT);

    const RET_VAL = {
      items: formatResponse(datasource.configuration, AI_SEARCH_AND_ANALYSIS_SERVICES),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, query });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery
}
