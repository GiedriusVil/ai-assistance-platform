/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  matchAttributeSkill,
  matchAttributeSource,
  matchAttributeTopIntent,
  matchAttributeMessage,
  matchFieldBetween2Dates,
  matchAttributeConversationId,
  matchAttributeAssistantIdByParams,
  matchAttributeAssistantIdByContext,
  //
  addTableLookUp,
  addPagination,
  addSortCondition,
  matchAttributeByRegex,
  matchFeedbackIds,
  matchActionNeeded,
  matchFalsePositiveIntents,
} = require('@ibm-aiap/aiap-utils-mongo');


const utterancesMatcher = (context, params) => {
  const FILTER = params?.filter;
  const FEEDBACK_IDS = params?.feedbackIds;
  return {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', FILTER),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(FILTER),
        matchAttributeConversationId(FILTER),
        matchAttributeSkill(FILTER),
        matchAttributeSource(params),
        matchAttributeTopIntent(FILTER),
        matchAttributeMessage(FILTER),
        matchFeedbackIds(FILTER, FEEDBACK_IDS),
        matchActionNeeded(FILTER),
        matchFalsePositiveIntents(FILTER),
        {
          $or: [
            matchAttributeByRegex('_id', params?.search),
            matchAttributeByRegex('conversationId', params?.search),
          ]
        }
      ],
    },
  }
};

const addProjectExclusion = (pipeline, params) => {
  const EXCLUSION = ramda.path(['§exclusion'], params);
  if (!lodash.isEmpty(EXCLUSION)) {
    const PROJECT_EXCLUSION = {
      $project: EXCLUSION
    };
    pipeline.push(PROJECT_EXCLUSION);
  }
}

const aggregatePipeline = (datasource, context, params) => {
  const RET_VAL = [];
  RET_VAL.push(utterancesMatcher(context, params));
  addProjectExclusion(RET_VAL, params);
  RET_VAL.push(
    {
      $facet: {
        items: [
          ...addSortCondition(params),
          ...addPagination(params),
          ...addTableLookUp(datasource._collections.entities, '_id', 'utteranceId', 'entities'),
          ...addTableLookUp(datasource._collections.users, 'conversationId', 'conversationId', 'users'),
          ...addTableLookUp(datasource._collections.feedbacks, '_id', 'utteranceId', 'feedbacks'),
          ...addTableLookUp(datasource._collections.intents, '_id', 'utteranceId', 'intents'),
        ],
        total: [
          {
            $count: 'count',
          },
        ]
      }
    }
  );
  RET_VAL.push(
    {
      $set: { tempTotal: { $arrayElemAt: ['$total', 0] } }
    }
  );
  RET_VAL.push(
    {
      $project: {
        items: 1,
        total: { $ifNull: ['$tempTotal.count', 0] },
      }
    }
  );
  return RET_VAL;
}

module.exports = {
  aggregatePipeline,
};
