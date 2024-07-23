/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
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
        {
          $or: [
            matchFieldBetween2Dates('timestamp', params),
          ]
        },
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProject2Pipeline = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      month: {
        $month: '$timestamp'
      },
      year: {
        $year: '$timestamp'
      },
      confidence: '$topIntentScore'
    }
  };
  pipeline.push(PROJECT);
}

const addGroup2PipelineByYearAndMonth = (context, params, pipeline) => {
  const GROUP_BY_MONTH = {
    $group: {
      _id: {
        month: '$month',
        year: '$year'
      },
      confidenceAverage: {
        $avg: '$confidence'
      }
    }
  };
  pipeline.push(GROUP_BY_MONTH);
}

const addProject2PipelineCount = (context, params, pipeline) => {
  const COUNT_PROJECT = {
    $project: {
      _id: 0,
      month: '$_id.month',
      year: '$_id.year',
      count: {
        $multiply: ['$confidenceAverage', 100]
      }
    }
  };
  pipeline.push(COUNT_PROJECT);
}

const addSort2Pipeline = (context, params, pipeline) => {
  const SORTING_PARAMS = {
    $sort: {
      year: 1,
      month: 1
    }
  };
  pipeline.push(SORTING_PARAMS);
}

const aggregatePipeline = (context, params) => {
  const PIPELINE = [];
  addMatch2Pipeline(context, params, PIPELINE);
  addProject2Pipeline(context, params, PIPELINE);
  addGroup2PipelineByYearAndMonth(context, params, PIPELINE);
  addProject2PipelineCount(context, params, PIPELINE);
  addSort2Pipeline(context, params, PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
