/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-datasoure-utterances-retrieve-totals';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const _feedbacks = require('../../feedbacks');

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');

const _retrieveFeedbackIds = async (datasource, context, params) => {
  const FEEDBACKS = await _feedbacks.findManyByQuery(datasource, context, params);
  const FEEDBACKS_ITEMS = ramda.pathOr([], ['items'], FEEDBACKS);
  const RET_VAL = FEEDBACKS_ITEMS.map(item => {
    return item.utteranceId;
  });
  return RET_VAL;
};

const retrieveTotals = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.utterances;

  let query;
  try {
    const RETRIEVE_NEGATIVE_FEEDBACKS_PARAMS = {
      queryDate: params.queryDate,
      score: -1,
      sort: {
        field: 'created',
        direction: 'asc'
      }
    };
    const RETRIEVE_POSITIVE_FEEDBACKS_PARAMS = {
      queryDate: params.queryDate,
      score: 1,
      sort: {
        field: 'created',
        direction: 'asc'
      }
    };

    const [positiveFeedbackIds, negativeFeedbackIds] = await Promise.all([
      _retrieveFeedbackIds(datasource, context, RETRIEVE_POSITIVE_FEEDBACKS_PARAMS),
      _retrieveFeedbackIds(datasource, context, RETRIEVE_NEGATIVE_FEEDBACKS_PARAMS)
    ]);

    params.positiveFeedbackIds = positiveFeedbackIds;
    params.negativeFeedbackIds = negativeFeedbackIds;

    query = aggregateQuery(context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const RET_VAL = {
      // FIX ME actionNeeded
      // actionNeeded: R.pathOr(0, [0, 'count'], actionNeeded),
      actionNeeded: ramda.pathOr(0, ['actionNeeded', 0, 'count'], RESULT),
      falsePositiveIntents: ramda.pathOr(0, ['falsePositiveIntents', 0, 'count'], RESULT),
      negativeFeedback: ramda.pathOr(0, ['negativeFeedback', 0, 'count'], RESULT),
      positiveFeedback: ramda.pathOr(0, ['positiveFeedback', 0, 'count'], RESULT),
      allUtterances: ramda.pathOr(0, ['allUtterances', 0, 'count'], RESULT)
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(retrieveTotals.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  retrieveTotals
}
