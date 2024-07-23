/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-conversations-find-with-user-interaction-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { replaceEmptyHoursWithZeros } = require('@ibm-aiap/aiap-utils-date');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregatePipeline } = require('./aggregate-pipeline');

const findWithUserInteractionHourGroups = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.conversations;

  let pipeline;
  try {
    if (
      lodash.isEmpty(params)
    ) {
      logger.warn('Passed params are empty. Will do my best!', { params });
    }
    pipeline = aggregatePipeline(context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline,
      });

    const AGGREGATION_REPLACE_VALUE = 'total';
    const RET_VAL = replaceEmptyHoursWithZeros(RESULT, AGGREGATION_REPLACE_VALUE);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findWithUserInteractionHourGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findWithUserInteractionHourGroups
}
