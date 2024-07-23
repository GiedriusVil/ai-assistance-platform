/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
} = require('@ibm-aiap/aiap-utils-mongo');


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
        }
      ]
    },
  };
  return RET_VAL;
}

const groupIds = () => {
  const RET_VAL = {
    $group: {
      _id: null,
      ids: {
        $push: '$_id'
      }
    },
  };
  return RET_VAL;
}

const projectIds = () => {
  const RET_VAL = {
    $project: {
      ids: '$ids',
      count: {
        $size: '$ids'
      },
      _id: 0
    }
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
    groupIds(),
    projectIds()
  ];
  return RET_VAL;
}

module.exports = {
  aggregateQuery
};
