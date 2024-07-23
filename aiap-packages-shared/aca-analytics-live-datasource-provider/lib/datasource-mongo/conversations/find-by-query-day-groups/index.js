/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-conversations-find-day-groups-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { replaceEmptyDatesWithZeros } = require('@ibm-aiap/aiap-utils-date');

const { aggregateQuery } = require('./aggregate-query');

const findByQueryDayGroups = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.conversations;

  let pipeline;
  try {
    if (
      lodash.isEmpty(params)
    ) {
      logger.warn('Passed params are empty. Will do my best!', { params });
    }
    pipeline = aggregateQuery(context, params);
    logger.info(findByQueryDayGroups.name, { pipeline });

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline,
      });

    const AGGREGATION_REPLACE_VALUE = 'conv_count';
    replaceEmptyDatesWithZeros(RET_VAL, params, AGGREGATION_REPLACE_VALUE);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findByQueryDayGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findByQueryDayGroups
}
