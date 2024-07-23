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


const addMatchIdNotEmptyToPipeline = (pipeline) => {
  const MATCH = {
    $match: {
      $and: [
        {
          _id: {
            $exists: true,
            $ne: null
          }
        }
      ]
    },
  };
  pipeline.push(MATCH);
}

const addGroupByScoreToPipeline = (pipeline) => {
  const GROUP_BY_SCORE = {
    $group: {
      _id: '$score',
      total: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP_BY_SCORE);
}

const addFinalProjectToPipeline = (pipeline) => {
  const PROJECT_TOTAL = {
    $project: {
      _id: 0,
      feedback: '$_id',
      total: 1
    }
  };
  pipeline.push(PROJECT_TOTAL);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addGroupByScoreToPipeline(PIPELINE);
  addMatchIdNotEmptyToPipeline(PIPELINE);
  addFinalProjectToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
