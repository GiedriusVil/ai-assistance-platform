/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conversations-express-router-feedbacks-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest,
  constructQueryDateRangeFromRequest
} = require('@ibm-aiap/aiap-utils-express-routes');

const { feedbacksService } = require('@ibm-aca/aca-conversations-service');

const findManyByQuery = async (request, response) => {
  const ERRORS = [];

  const QUERY_DATE = constructQueryDateRangeFromRequest(request);
  const DEFAULT_QUERY = constructDefaultFindManyQueryFromRequest(request);

  const CONVERSATION_ID = ramda.path(['query', 'conversationId'], request);
  const SCORE = ramda.path(['query', 'score'], request);
  const STATUS = ramda.path(['query', 'status'], request);
  const ACTION_NEEDED = ramda.path(['query', 'actionNeeded'], request);

  let retVal;
  try {
    if (
      lodash.isEmpty(ERRORS)
    ) {
      const CONTEXT = constructActionContextFromRequest(request);
      const FIND_MANY_BY_QUERY_PARAMS = {
        queryDate: QUERY_DATE,
        conversationId: CONVERSATION_ID,
        score: SCORE,
        status: STATUS,
        actionNeeded: ACTION_NEEDED,
        ...DEFAULT_QUERY
      };
      logger.info('FIND_MANY_BY_QUERY_PARAMS', { FIND_MANY_BY_QUERY_PARAMS });
      retVal = await feedbacksService.findManyByQuery(CONTEXT, FIND_MANY_BY_QUERY_PARAMS);
    }
  } catch (error) {
    ERRORS.push({
      type: 'SYSTEM_ERROR',
      text: `${error}`,
      json: error
    });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error('ERRORS', { ERRORS });
    response.status(500).json(ERRORS);
  }
}

module.exports = {
  findManyByQuery,
}
