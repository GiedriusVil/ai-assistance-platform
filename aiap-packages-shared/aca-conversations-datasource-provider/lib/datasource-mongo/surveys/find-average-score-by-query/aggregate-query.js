/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeConversationId,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const addSurveysMatcher = (context, params, pipeline) => {
  const FILTERS = params?.filter;
  const STEP = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created', FILTERS),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(FILTERS),
        matchAttributeConversationId(FILTERS),
        {
          $or: [
            matchAttributeByRegex('_id', params?.search),
            matchAttributeByRegex('conversationId', params?.search),
          ]
        }
      ]
    },
  };
  pipeline.push(STEP);
}

const addAverageCalculation = (context, params, pipeline) => {
  const STEP = {
    $group: {
      _id: null,
      avgNps: {
        $avg: '$score'
      }
    }
  }
  pipeline.push(STEP);
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [];
  addSurveysMatcher(context, params, RET_VAL);
  addAverageCalculation(context, params, RET_VAL);
  return RET_VAL;
}

module.exports = {
  aggregateQuery,
}
