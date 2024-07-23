/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-utterances-count-transfers-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregatePipeline } = require('./aggregate-pipeline');

const countTransfersByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;

  let pipeline;
  try {
    if (
      lodash.isEmpty(params)
    ) {
      logger.warn('Passed params are empty. Will do my best!', { params });
    }
    pipeline = aggregatePipeline(context, params);
    logger.info(countTransfersByQuery.name, { pipeline });

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline
      });

    const RET_VAL = ramda.pathOr(0, [0, 'total'], RESULT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(countTransfersByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  countTransfersByQuery
}
