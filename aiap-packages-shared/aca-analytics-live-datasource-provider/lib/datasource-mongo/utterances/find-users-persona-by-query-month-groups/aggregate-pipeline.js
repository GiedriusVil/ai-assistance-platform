/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  nMatchAttributeByArrayOfPrimitives,
  matchAttributeByObject
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
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
        matchAttributeByObject('context.private.userProfile.persona', params?.query?.filter?.persona)
      ]
    },
  };
  pipeline.push(MATCHER);
}

const unwindFields = (pipeline) => {
  const UNWIND = {
    $unwind: {
      path: '$context.private.userProfile'
    }
  }
  pipeline.push(UNWIND);
}

const addProjectGroupFieldsToPipeline = (pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      month: { $month: '$timestamp' },
      year: { $year: '$timestamp' },
      userId: '$context.private.userProfile.id'
    }
  };
  pipeline.push(PROJECT);
}

const addGroupByMonthToPipeline = (pipeline) => {
  const GROUP_BY_MONTH = {
    $group: {
      _id: { month: '$month', year: '$year', userId: '$userId' },
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
      count: {
        $sum: 1
      }
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
  unwindFields(PIPELINE);
  addProjectGroupFieldsToPipeline(PIPELINE);
  addGroupByMonthToPipeline(PIPELINE);
  addCountProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
