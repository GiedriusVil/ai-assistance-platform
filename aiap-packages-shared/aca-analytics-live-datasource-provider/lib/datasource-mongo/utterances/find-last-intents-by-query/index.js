/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-utterances-find-last-intents-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregatePipeline } = require('./aggregate-pipeline');

const findLastIntentsByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;

  let pipeline;
  try {
    if (lodash.isEmpty(params)) {
      logger.warn('Params passed are empty', { params });
    }
    pipeline = aggregatePipeline(context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findLastIntentsByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findLastIntentsByQuery
}
