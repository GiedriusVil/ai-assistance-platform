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

const addParamsMatchToFilter = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('userId', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const matchMessagesWithTransfer = (pipeline) => {
  const MATCH = {
    $match: {
      message: '§§TRANSFER'
    }
  };
  pipeline.push(MATCH);
}

const setDateValue = (pipeline) => {
  const DATE =
  {
    $set: {
      timestamp: {
        $dateFromString: { dateString: '$created' }
      }
    }
  };
  pipeline.push(DATE);
}

const addProjectGroupFieldsToPipeline = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      start: projectField$DateToString(context?.user?.timezone, '%H', '$timestamp'),
    }
  };
  pipeline.push(PROJECT);
}

const countTransfersInPipeline = (pipeline) => {
  const GROUP = {
    $group: {
      _id: '$start',
      total: {
        $sum: 1
      }
    }
  };
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
  matchMessagesWithTransfer(PIPELINE);
  setDateValue(PIPELINE);
  addProjectGroupFieldsToPipeline(context, params, PIPELINE);
  countTransfersInPipeline(PIPELINE);
  addFinalProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
