/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasoure-utterances-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const _feedbacks = require('../../feedbacks');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { aggregatePipeline } = require('./aggregate-pipeline');
const { formatResponse } = require('./format-response');

const _retrieveFeedbackIds = async (datasource, context, params) => {
  try {
    const FEEDBACKS = await _feedbacks.findManyByQuery(datasource, context, params);
    const FEEDBACKS_ITEMS = ramda.pathOr([], ['items'], FEEDBACKS);
    const RET_VAL = FEEDBACKS_ITEMS.map(item => {
      return item.utteranceId;
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_retrieveFeedbackIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const findManyByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;
  let pipeline;
  try {
    const RETRIEVE_FEEDBACKS_PARAMS = {
      queryDate: params?.filter?.dateRange,
      score: params?.filter?.score,
      sort: {
        field: 'created',
        direction: 'asc'
      },
      options: {
        allowDiskUse: true,
      }
    };
    const FEEDBACK_IDS = await _retrieveFeedbackIds(datasource, context, RETRIEVE_FEEDBACKS_PARAMS);
    params.feedbackIds = FEEDBACK_IDS;

    pipeline = aggregatePipeline(datasource, context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline,
        options: params?.options,
      });
    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const UTTERANCES = ramda.pathOr([], ['items'], RESULT);
    const TOTAL_COUNT = ramda.pathOr(0, ['total'], RESULT);

    const RET_VAL = {
      items: formatResponse(UTTERANCES),
      total: TOTAL_COUNT
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery
}
