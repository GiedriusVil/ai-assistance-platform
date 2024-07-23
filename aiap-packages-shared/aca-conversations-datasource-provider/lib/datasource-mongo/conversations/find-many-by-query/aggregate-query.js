/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeId,
  matchAttributeByRegex,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  addTableLookUp,
  addSortCondition,
  addPagination,
  matchAttributeChannels,
} = require('@ibm-aiap/aiap-utils-mongo');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const matchHideZeroDuration = (params) => {
  const RET_VAL = {};
  if (params.isZeroDurationVisible !== true) {
    RET_VAL.duration = {
      $gt: 0
    };
  }
  return RET_VAL;
}

const matchUserInteractionIsVisible = (params) => {
  let retVal = {};

  if (
    params.isNoUserInteractionVisible !== true
  ) {
    retVal = {
      $or: [
        {
          hasUserInteraction: {
            $eq: true
          }
        },
        {
          hasUserInteraction: {
            $exists: false
          }
        }
      ]
    };
  }
  return retVal;
}

const matchIsReviewedVisible = (params) => {
  let retVal = {};
  if (
    params.isReviewedVisible !== true
  ) {
    retVal = {
      $or: [
        {
          reviewed: {
            $exists: false
          }
        },
        {
          reviewed: {
            $size: 0
          }
        }
      ]
    };
  }
  return retVal;
}

const conversationsMatcher = (context, params) => {
  const FILTER = params?.filter;
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('start', FILTER),
            matchFieldBetween2Dates('end', FILTER),
          ]
        },
        {
          $or: [
            matchAttributeByRegex('_id', FILTER?.search),
            matchAttributeByRegex('userId', FILTER?.search),
            matchAttributeByRegex('tags.tags', FILTER?.search),
          ]
        },
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(FILTER),
        matchAttributeId(FILTER),
        matchUserInteractionIsVisible(FILTER),
        matchHideZeroDuration(FILTER),
        matchIsReviewedVisible(FILTER),
        matchAttributeChannels(FILTER),
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
        items: [
          ...addSortCondition(params),
          ...addPagination(params),
          ...addTableLookUp(datasource._collections.surveys, '_id', 'conversationId', 'surveys'),
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
