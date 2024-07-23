/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  matchAttributeByRegex,
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  nMatchAttributeByArrayOfPrimitives
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatch2Pipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        matchAttributeByRegex('context.private.user.email', params.userEmail.toLowerCase()),
        { topIntent: { $ne: null } },
        { topIntent: { $ne: '' } },
        { 'raw.message.text': { $ne: null } },
        { 'raw.message.text': { $ne: '' } },
        { 'raw.message.text': { $not: /§§§/ } },
        nMatchAttributeByArrayOfPrimitives('topIntent', params?.query?.nFilter?.intents),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addSort2PipelineByTimestamp = (context, params, pipeline) => {
  const SORT = {
    $sort: {
      timestamp: -1
    }
  };
  pipeline.push(SORT);
}

const addLimit2Pipeline = (context, params, pipeline) => {
  const LIMIT = {
    $limit: ramda.pathOr(5, ['query', 'pagination', 'size'], params)
  };
  pipeline.push(LIMIT);
}

const addProject2PipelineFinal = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      utterance: '$_id',
      message: '$message',
      intent: '$topIntent'
    }
  };
  pipeline.push(PROJECT);
}

const aggregatePipeline = (context, params) => {
  const PIPELINE = [];
  addMatch2Pipeline(context, params, PIPELINE);
  addSort2PipelineByTimestamp(context, params, PIPELINE);
  addLimit2Pipeline(context, params, PIPELINE);
  addProject2PipelineFinal(context, params, PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline
}
