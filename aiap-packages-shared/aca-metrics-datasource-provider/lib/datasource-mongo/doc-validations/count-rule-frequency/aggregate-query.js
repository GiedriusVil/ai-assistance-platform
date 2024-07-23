/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchRuleType,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const FILTER = ramda.path(['filter'], params);
  const MATCHER = {
    $match: {
      $and: [
        { 'action': 'RESPONSE_READY' },
        matchRuleType(FILTER),
        {
          $or: [
            matchFieldBetween2Dates('created.date', FILTER),
          ]
        }
      ]
    },
  };
  pipeline.push(MATCHER);
}

const unwindValidations = (context, params, pipeline) => {
  const UNWIND = {
    $unwind: '$doc.validation',
  }
  pipeline.push(UNWIND);
}

const sortByCount = (context, params, pipeline) => {
  const SORT_BY_COUNT = {
    $sortByCount: '$doc.validation.data.rule.key',
  }

  pipeline.push(SORT_BY_COUNT);
}

const limitResults = (context, params, pipeline) => {
  const LIMIT_COUNT = params?.pagination?.size || 10;
  const LIMIT = {
    $limit: LIMIT_COUNT,
  }

  pipeline.push(LIMIT);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  unwindValidations(context, params, PIPELINE);
  sortByCount(context, params, PIPELINE);
  limitResults(context, params, PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
