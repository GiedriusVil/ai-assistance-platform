/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  nMatchAttributeByArrayOfPrimitives,
  nMatchByAttribute,
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('userId', params?.query?.nFilter?.userIds),
        nMatchAttributeByArrayOfPrimitives('author', params?.query?.nFilter?.author),
        nMatchByAttribute('message', params?.query?.nFilter.message)
      ]
    },
  };
  pipeline.push(MATCHER);
}


const addCountToPipeline = (pipeline) => {
  const COUNT_PROJECT = {
    $count: 'total'
  };
  pipeline.push(COUNT_PROJECT);
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
