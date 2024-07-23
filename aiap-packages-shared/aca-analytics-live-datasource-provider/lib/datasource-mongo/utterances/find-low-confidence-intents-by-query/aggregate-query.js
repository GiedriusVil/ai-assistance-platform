/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

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
        matchFieldBetween2Dates('timestamp', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('context.private.user.id', params?.query?.nFilter?.userIds),
        {
          'topIntentScore': {
            '$lte': Number(params?.query?.filter?.confidence)
          }
        }
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addGroupTopIntentToPipeline = (pipeline) => {
  const GROUP = {
    $group: {
      _id: '$topIntent',
      count: {
        $sum: 1
      }
    }
  };
  pipeline.push(GROUP);
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

const addSortByCountDescendingToPipeline = (pipeline) => {
  const SORT = {
    $sort: {
      count: -1
    }
  };
  pipeline.push(SORT);
}

const addLimitToPipeline = (context, params, pipeline) => {
  const LIMIT = {
    $limit: ramda.pathOr(5, ['limit'], params),
  };
  pipeline.push(LIMIT);
}



const addFinalProject = (pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      intent: '$_id',
      total: '$count'
    }
  };
  pipeline.push(PROJECT);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addGroupTopIntentToPipeline(PIPELINE);
  addMatchIdNotEmptyToPipeline(PIPELINE);
  addSortByCountDescendingToPipeline(PIPELINE);
  addLimitToPipeline(context, params, PIPELINE);
  addFinalProject(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
