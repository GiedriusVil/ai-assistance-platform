/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasource-surveys-find-average-score-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { aggregateQuery } = require('./aggregate-query');

const findAvgScoreByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.surveys;

  let query;
  try {
    query = aggregateQuery(context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);

    const AVG_NPS = RESULT?.avgNps || 0;
    
    const RET_VAL = {
      avgNps: AVG_NPS,
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findAvgScoreByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  findAvgScoreByQuery
}
