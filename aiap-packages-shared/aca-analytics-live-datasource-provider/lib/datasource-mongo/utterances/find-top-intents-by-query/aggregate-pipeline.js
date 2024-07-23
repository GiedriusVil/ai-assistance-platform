/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
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
        {
          topIntent: { $exists: true, $ne: null }
        },
        {
          'raw.message.text': { $exists: true, $ne: null }
        },
        {
          'raw.message.text': { $not: /§§§/ }
        },
        nMatchAttributeByArrayOfPrimitives('topIntent', params?.query?.nFilter?.intents),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addGroup2PipelineByTopIntent = (context, params, pipeline) => {
  const GROUP = {
    $group: {
      _id: '$topIntent',
      requestTexts: {
        $addToSet: '$request.text'
      },
      count: {
        $sum: 1
      }
    },
  };
  pipeline.push(GROUP);
}

const addSort2PipelineByCount = (context, params, pipeline) => {
  const SORT = {
    $sort: {
      count: -1
    }
  };
  pipeline.push(SORT);
}

const addLimit2Pipeline = (context, params, pipeline) => {
  const LIMIT = {
    $limit: ramda.pathOr(5, ['query', 'pagination', 'size'], params),
  };
  pipeline.push(LIMIT);
}

const addProject2PipelineFinal = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      intent: '$_id',
      messages: '$messages',
      total: '$count'
    }
  };
  pipeline.push(PROJECT);
}

const aggregatePipeline = (context, params) => {
  const PIPELINE = [];
  addMatch2Pipeline(context, params, PIPELINE);
  addGroup2PipelineByTopIntent(context, params, PIPELINE);
  addSort2PipelineByCount(context, params, PIPELINE);
  addLimit2Pipeline(context, params, PIPELINE);
  addProject2PipelineFinal(context, params, PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
