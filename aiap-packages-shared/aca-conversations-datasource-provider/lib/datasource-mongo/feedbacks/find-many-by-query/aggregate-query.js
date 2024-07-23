/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeConversationId,
  matchAttributeScore,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  addSortCondition,
  addPagination,
} = require('@ibm-aiap/aiap-utils-mongo');

const feedbacksMatcher = (context, params) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        matchAttributeConversationId(params),
        matchAttributeScore(params),
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [
    feedbacksMatcher(context, params),
    {
      $facet: {
        feedbacks: [
          ...addSortCondition(params),
          ...addPagination(params)
        ],
        total: [
          {
            $count: 'count',
          }
        ]
      }
    }
  ];
  RET_VAL.push(
    {
      $set: { tempTotal: { $arrayElemAt: ['$total', 0] } }
    }
  );
  RET_VAL.push(
    {
      $project: {
        feedbacks: 1,
        total: { $ifNull: ['$tempTotal.count', 0] },
      }
    }
  );
  return RET_VAL;
}

module.exports = {
  aggregateQuery,
}
