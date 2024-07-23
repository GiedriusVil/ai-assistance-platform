/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  projectField$DateToString,
  matchAttributeSource,
  nMatchAttributeByArrayOfPrimitives
} = require('@ibm-aiap/aiap-utils-mongo');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        matchAttributeSource(params),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProjectToHourToPipeline = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      hour: projectField$DateToString(context?.user?.timezone, '%H', '$timestamp')
    }
  };
  pipeline.push(PROJECT);
}

const addGroupByHourToPipeline = (pipeline) => {
  const GROUP = {
    $group: {
      _id: '$hour',
      total: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP);
}

const addFinalProjectToPipeline = (pipeline) => {
  const PROJECT_TOTAL = {
    $project: {
      _id: 0,
      day: '$_id',
      total: 1
    }
  };
  pipeline.push(PROJECT_TOTAL);
}

const addSortingParamsToPipeline = (pipeline) => {
  const SORTING_PARAMS = {
    $sort: { day: 1 }
  };
  pipeline.push(SORTING_PARAMS);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addProjectToHourToPipeline(context, params, PIPELINE);
  addGroupByHourToPipeline(PIPELINE);
  addFinalProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
