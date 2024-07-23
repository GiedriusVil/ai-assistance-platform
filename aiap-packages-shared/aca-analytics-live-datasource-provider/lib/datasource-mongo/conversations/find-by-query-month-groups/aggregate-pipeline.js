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

const addMatcherToPipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('start', params),
          ]
        },
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('userId', params?.query?.nFilter?.userIds)
      ]
    }
  };
  pipeline.push(MATCHER);
}

const addProjectGroupFieldsToPipeline = (pipeline) => {
  const COUNT_PROJECT = {
    $project: {
      _id: 0,
      month: {
        $month: '$start'
      },
      year: {
        $year: '$start'
      },
      count: {
        $sum: 1
      }
    }
  };
  pipeline.push(COUNT_PROJECT);
}

const addGroupByMonthToPipeline = (pipeline) => {
  const GROUP_BY_MONTH = {
    $group: {
      _id: { month: '$month', year: '$year' },
      count: { $sum: 1 }
    }
  };
  pipeline.push(GROUP_BY_MONTH);
}

const addCountProjectToPipeline = (pipeline) => {
  const COUNT_PROJECT = {
    $project: {
      _id: 0,
      month: '$_id.month',
      year: '$_id.year',
      count: '$count'
    }
  };
  pipeline.push(COUNT_PROJECT);
}

const addSortingParamsToPipeline = (pipeline) => {
  const SORTING_PARAMS = {
    $sort: { year: 1, month: 1 }
  };
  pipeline.push(SORTING_PARAMS);
}

const aggregatePipeline = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addProjectGroupFieldsToPipeline(PIPELINE);
  addGroupByMonthToPipeline(PIPELINE);
  addCountProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
