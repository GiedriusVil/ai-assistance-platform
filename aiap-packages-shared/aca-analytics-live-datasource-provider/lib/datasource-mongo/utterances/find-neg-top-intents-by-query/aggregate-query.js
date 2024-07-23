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
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProjectIdAndTopIntentToPipeline = (pipeline) => {
  const PROJECT = {
    $project: {
      _id: 1,
      topIntent: 1
    }
  };
  pipeline.push(PROJECT);
}

const addFeedbacksLookupToPipeline = (collections, context, params, pipeline) => {
  const LOOKUP = {
    $lookup: {
      from: collections.feedbacks,
      let: { utt_id: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$utteranceId', '$$utt_id'] },
                { $eq: ['$score', -1] }
              ]
            }
          }
        },
        { $project: { _id: 0, score: 1 } }
      ],
      as: 'feedbacks'
    }
  };
  pipeline.push(LOOKUP);
}

const addMatchNegFeedbacksWithNonEmptyTopIntentToPipeline = (pipeline) => {
  const MATCH = {
    $match: {
      $and: [
        { feedbacks: { $ne: [] } },
        {
          topIntent: {
            $exists: true,
            $ne: null
          }
        }
      ]
    }
  };
  pipeline.push(MATCH);
}

const addGroupByTopIntentToPipeline = (pipeline) => {
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

const addDefaultSortToPipeline = (pipeline) => {
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

const addFinalProjectToPipeline = (pipeline) => {
  const PROJECT = {
    $project: {
      intent: '$_id',
      total: '$count'
    }
  };
  pipeline.push(PROJECT);
}

const aggregateQuery = (collections, context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addProjectIdAndTopIntentToPipeline(PIPELINE);
  addFeedbacksLookupToPipeline(collections, context, params, PIPELINE);
  addMatchNegFeedbacksWithNonEmptyTopIntentToPipeline(PIPELINE);
  addGroupByTopIntentToPipeline(PIPELINE);
  addDefaultSortToPipeline(PIPELINE);
  addLimitToPipeline(context, params, PIPELINE);
  addFinalProjectToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
