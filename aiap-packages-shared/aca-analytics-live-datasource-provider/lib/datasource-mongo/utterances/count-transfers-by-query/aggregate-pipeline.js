/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  nMatchAttributeByArrayOfPrimitives,
  matchAttributeByObject
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
        matchAttributeByObject('metricsTracker.transferToAgent', params?.query?.filter?.metricsTracker?.transferToAgent)
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addCountToPipeline = (pipeline) => {
  const COUNT = {
    $count: 'total'
  }
  pipeline.push(COUNT);
}

const aggregatePipeline = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addCountToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
