/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  projectField$DateToString,
  nMatchAttributeByArrayOfPrimitives,
  matchAttributeByObject
} = require('@ibm-aiap/aiap-utils-mongo');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
        matchAttributeByObject('metricsTracker.transferToAgent', params?.query?.filter?.metricsTracker?.transferToAgent),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProjectToDayToPipeline = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      day: projectField$DateToString(context?.user?.timezone, '%Y-%m-%d', '$timestamp'),
    }
  };
  pipeline.push(PROJECT);
}

const addGroupByDayToPipeline = (pipeline) => {
  const GROUP_BY_DAY = {
    $group: {
      _id: '$day',
      total: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP_BY_DAY);
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
  addProjectToDayToPipeline(context, params, PIPELINE);
  addGroupByDayToPipeline(PIPELINE);
  addFinalProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
