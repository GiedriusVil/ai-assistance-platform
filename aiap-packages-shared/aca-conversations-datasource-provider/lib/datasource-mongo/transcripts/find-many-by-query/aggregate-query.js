/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeByRegex,
  nMatchByBooleanAttribute,
  addTableLookUp,
  addSortCondition,
  addPagination
} = require('@ibm-aiap/aiap-utils-mongo');


const conversationsMatcher = (context, params) => {
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('start', params),
            matchFieldBetween2Dates('end', params),
          ]
        },
        matchAttributeByRegex('userId', params.employeeId),
        nMatchByBooleanAttribute(params?.attribute?.attribute, params?.attribute?.value),
      ]
    },
  };
  return RET_VAL;
}

/**
 * Generates aggregation pipeline for ordered list of conversations based on start/end dates or conversation id.
 * Supported query params:
 *  - from: start date
 *  - to: end date
 *  - size: number of items to be returned
 *  - page: page number
 *  - field: sort field
 *  - sort: sorting order
 *  - conversationId: conversation id
 * @param {*} params Query parameters
 * @returns {*} Mongo aggregation pipeline
 */
const aggregateQuery = (datasource, context, params) => {
  const RET_VAL = [
    conversationsMatcher(context, params),
    {
      $facet: {
        conversations: [
          ...addSortCondition(params),
          ...addPagination(params),
          ...addTableLookUp(datasource._collections.surveys, '_id', 'conversationId', 'surveysData'),
          ...addTableLookUp(datasource._collections.users, '_id', 'conversationId', 'usersData'),
          ...addTableLookUp(datasource._collections.messages, '_id', 'conversationId', 'messagesData'),
          ...addTableLookUp(datasource._collections.utterances, '_id', 'conversationId', 'utterancesData'),
          ...addTableLookUp(datasource._collections.feedbacks, '_id', 'conversationId', 'feedbacksData'),
          // ? whats going on here?
          // TO_DO: addFields with boolean value for condition where messageData with errors object.
          // TO_DO: Now this filter is in transformer.
        ],
        total: [
          {
            $count: 'count',
          },
        ]
      }
    }
  ];
  return RET_VAL;
}

module.exports = {
  aggregateQuery
};
