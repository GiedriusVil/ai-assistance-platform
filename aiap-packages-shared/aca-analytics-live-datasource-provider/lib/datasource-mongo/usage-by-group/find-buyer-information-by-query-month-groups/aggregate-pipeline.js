/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  matchAttributeArrayByArrayOfPrimitives,
  projectField$DateToString,
  nMatchAttributeByArrayOfPrimitives
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('timestamp', params)
          ]
        },
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('userId', params?.query?.nFilter?.userIds),
        matchAttributeArrayByArrayOfPrimitives('aiServiceResponse.external.result.intents', 'intent', params?.query?.filter?.intents),
        matchAttributeArrayByArrayOfPrimitives('aiServiceResponse.external.result.entities', 'entity', params?.query?.filter?.entities),
      ],
    },
  };
  pipeline.push(MATCHER);
}

const addGroupFieldsProjectToPipeline = (context, params, pipeline) => {
  const GROUP_PROJECT = {
    $project: {
      _id: 0,
      month: projectField$DateToString(context?.user?.timezone, '%m', '$timestamp'),
      year: projectField$DateToString(context?.user?.timezone, '%Y', '$timestamp'),
      count: { $sum: 1 }
    }
  };
  pipeline.push(GROUP_PROJECT);
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
  addGroupFieldsProjectToPipeline(context, params, PIPELINE);
  addGroupByMonthToPipeline(PIPELINE);
  addCountProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
