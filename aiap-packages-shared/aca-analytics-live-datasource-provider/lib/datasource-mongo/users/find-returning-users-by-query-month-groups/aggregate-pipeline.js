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

const addMatcherToPipeline = (context, params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('start', params),
            matchFieldBetween2Dates('end', params),
          ]
        },
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('_id', params?.query?.nFilter?.userIds),
      ],
    },
  };
  pipeline.push(MATCHER);
}

const lookupUsers = (collections, pipeline) => {
  const LOOKUP_USERS = {
    $lookup: {
      from: collections.users,
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  };
  pipeline.push(LOOKUP_USERS);
}
const unwindUser = (pipeline) => {
  const UNWIND = {
    $unwind: '$user'
  };
  pipeline.push(UNWIND);
}

const matchReturningUsers = (pipeline) => {
  const MATCH = {
    $match: {
      $expr: {
        $and: [
          { $ne: ['$user.created', '$user.lastVisitTimestamp'] }
        ]
      }
    }
  };
  pipeline.push(MATCH);
}

const addGroupByMonthToPipeline = (pipeline) => {
  const GROUP_BY_MONTH = {
    $group: {
      _id: {
        month: {
          $month: '$start'
        },
        year: {
          $year: '$start'
        },
        userId: '$user._id'
      },

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

const aggregatePipeline = (collections, context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  lookupUsers(collections, PIPELINE);
  unwindUser(PIPELINE);
  matchReturningUsers(PIPELINE);
  addGroupByMonthToPipeline(PIPELINE);
  addCountProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregatePipeline,
}
