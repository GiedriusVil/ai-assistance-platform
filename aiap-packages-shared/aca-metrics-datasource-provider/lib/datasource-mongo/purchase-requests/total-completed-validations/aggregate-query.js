/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeBuyerOrganizationIdByIds,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const FILTER = ramda.path(['filter'], params);
  const MATCHER = {
    $match: {
      $and: [
        { 'action': 'RESPONSE_TRANSFORMED' },
        {
          $or: [
            matchFieldBetween2Dates('timestamp', FILTER),
            matchFieldBetween2Dates('created.date', FILTER),
          ]
        },
        matchAttributeBuyerOrganizationIdByIds(FILTER),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addCountToPipeline = (pipeline) => {
  const TOTAL = {
    $count: 'total'
  }
  pipeline.push(TOTAL);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addCountToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
