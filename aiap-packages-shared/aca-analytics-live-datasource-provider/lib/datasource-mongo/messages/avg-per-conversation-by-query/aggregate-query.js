/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
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
        matchFieldBetween2Dates('created', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('userId', params?.query?.nFilter?.userIds),
        nMatchAttributeByArrayOfPrimitives('author', params?.query?.nFilter?.author),
        nMatchByAttribute('message', params?.query?.nFilter.message),
        matchAttributeSource(params),
      ]
    },
  };
  pipeline.push(MATCHER);
}


const addGroupByConversationIdToPipeline = (pipeline) => {
  const GROUP = {
    $group: {
      _id: '$conversationId',
      count: { $sum: 1 }
    }
  }
  pipeline.push(GROUP);
}

const addCalculateAverageToPipeline = (pipeline) => {
  const GROUP = {
    $group: {
      _id: null,
      average: { $avg: '$count' }
    }
  }
  pipeline.push(GROUP);
}

const addProjectOnlyAverageToPipeline = (pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      average: 1
    }
  }
  pipeline.push(PROJECT);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addGroupByConversationIdToPipeline(PIPELINE);
  addCalculateAverageToPipeline(PIPELINE);
  addProjectOnlyAverageToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
