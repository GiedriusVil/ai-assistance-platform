/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-conversations-find-avg-duration-by-query-hour-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { replaceEmptyHoursWithZeros } = require('@ibm-aiap/aiap-utils-date');

const { aggregateQuery } = require('./aggregate-query');

const findAvgDurationByQueryHourGroups = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.conversations;

  let query;
  try {
    if (lodash.isEmpty(params)) {
      logger.warn('Passed params are empty. Will do my best!', { params });
    }
    query = aggregateQuery(context, params);
    logger.info(findAvgDurationByQueryHourGroups.name, { query });

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });

    const AGGREGATION_REPLACE_VALUE = 'avg_duration';
    const RET_VAL = replaceEmptyHoursWithZeros(RESULT, AGGREGATION_REPLACE_VALUE);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findAvgDurationByQueryHourGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findAvgDurationByQueryHourGroups
}
