/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  projectField$DateToString,
  nMatchAttributeByArrayOfPrimitives
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('start', params),
            matchFieldBetween2Dates('end', params),
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

const addProjectGroupFieldsToPipeline = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      start: projectField$DateToString(context?.user?.timezone, '%Y-%m-%d', '$start')
    }
  };
  pipeline.push(PROJECT);
}


const addGroupByStartToPipeline = (pipeline) => {
  const GROUP_BY_DAY = {
    $group: {
      _id: '$start',
      conv_count: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP_BY_DAY);
}

const addCountProjectToPipeline = (pipeline) => {
  const COUNT_PROJECT = {
    $project: {
      _id: 0,
      day: '$_id',
      conv_count: 1
    }
  };
  pipeline.push(COUNT_PROJECT);
}

const addSortingParamsToPipeline = (pipeline) => {
  const SORTING_PARAMS = {
    $sort: { day: 1 }
  };
  pipeline.push(SORTING_PARAMS);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addProjectGroupFieldsToPipeline(context, params, PIPELINE);
  addGroupByStartToPipeline(PIPELINE);
  addCountProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
