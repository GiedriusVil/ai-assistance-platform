/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-utterances-avg-per-conversation-by-query-day-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { replaceEmptyDatesWithZeros } = require('@ibm-aiap/aiap-utils-date');

const { aggregateQuery } = require('./aggregate-query');

const avgPerConversationByQueryDayGroups = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;

  let query;
  try {
    if (lodash.isEmpty(params)) {
      logger.warn('Passed params are empty. Will do my best!', { params });
    }
    query = aggregateQuery(context, params);
    logger.info(avgPerConversationByQueryDayGroups.name, { query });

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query
      });
    const AGGREGATION_REPLACE_VALUE = 'avg';
    replaceEmptyDatesWithZeros(RET_VAL, params, AGGREGATION_REPLACE_VALUE);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(avgPerConversationByQueryDayGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  avgPerConversationByQueryDayGroups
}
