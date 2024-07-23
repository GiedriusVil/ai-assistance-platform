/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasoure-utterances-find-many-by-query-v2';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { aggregatePipeline } = require('./aggregate-pipeline');
const { formatResponse } = require('./format-response');

const findManyByQueryV2 = async (datasource, context, params) => {
  let pipeline;
  try {
    const COLLECTION = datasource._collections.utterances;
    if (lodash.isEmpty(params)) {
      logger.warn('Passed params are empty. Will do my best!', { params });
    }
    pipeline = aggregatePipeline(params);
    logger.info(findManyByQueryV2.name, { pipeline });
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline,
        options: params?.options,
      });

    const AGGREGATION_RESULT = ramda.pathOr({}, [0], RESPONSE);
    const UTTERANCES = ramda.pathOr([], ['utterances'], AGGREGATION_RESULT);
    const TOTAL = ramda.pathOr({}, ['total'], AGGREGATION_RESULT);
    const RET_VAL = {
      items: formatResponse(UTTERANCES),
      total: ramda.pathOr(UTTERANCES.length, [0, 'count'], TOTAL),
    };
    return RET_VAL;
  }
  catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params, pipeline });
    logger.error(findManyByQueryV2.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  findManyByQueryV2,
};
