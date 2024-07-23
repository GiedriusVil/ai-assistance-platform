/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  matchAttributeSource,
  nMatchAttributeByArrayOfPrimitives,
  nMatchByAttribute,
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        matchAttributeSource(params),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
        matchExcludeEmptyMessage(params),
      ]
    },
  };
  pipeline.push(MATCHER);
}


const matchExcludeEmptyMessage = (params) => {
  let retVal = {};
  if (
    params.excludeEmptyMessage == true
  ) {
    retVal = nMatchByAttribute('message', '');
  }
  return retVal;
}


const addCountToPipeline = (pipeline) => {
  const COUNT_PROJECT = {
    $count: 'total'
  };
  pipeline.push(COUNT_PROJECT);
}


const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addCountToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
