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

const addMatcher2Pipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('created', params),
          ]
        },
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('userId', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProject2PipelineFlagPositive = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: '$_id',
      month: {
        $month: '$created'
      },
      year: {
        $year: '$created'
      },
      positive: {
        $cond: {
          if: {
            $gte: [
              '$score',
              0
            ]
          },
          then: 1,
          else: 0
        }
      },
    }
  };
  pipeline.push(PROJECT);
}

const addGroup2PipelineByYearAndMonth = (context, params, pipeline) => {
  const GROUP_BY_MONTH = {
    $group: {
      _id: {
        year: '$year',
        month: '$month',
      },
      totalPositive: {
        $sum: '$positive'
      },
      total: {
        $sum: 1
      }
    }
  };
  pipeline.push(GROUP_BY_MONTH);
}

const addProject2PipelineCount = (context, params, pipeline) => {
  const COUNT_PROJECT = {
    $project: {
      _id: 0,
      year: '$_id.year',
      month: '$_id.month',
      count: {
        $divide: [
          {
            $multiply: [
              '$totalPositive',
              100
            ]
          },
          '$total'
        ]
      }
    }
  };
  pipeline.push(COUNT_PROJECT);
}

const addSort2Pipeline = (context, params, pipeline) => {
  const SORTING_PARAMS = {
    $sort: {
      year: 1,
      month: 1,
    }
  };
  pipeline.push(SORTING_PARAMS);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcher2Pipeline(context, params, PIPELINE);
  addProject2PipelineFlagPositive(context, params, PIPELINE);
  addGroup2PipelineByYearAndMonth(context, params, PIPELINE);
  addProject2PipelineCount(context, params, PIPELINE);
  addSort2Pipeline(context, params, PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
