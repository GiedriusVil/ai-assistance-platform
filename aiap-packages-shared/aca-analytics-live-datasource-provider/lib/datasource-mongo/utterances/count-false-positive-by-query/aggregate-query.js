/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeAssistantIdByContext,
  matchAttributeAssistantIdByParams,
  groupAndSum,
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

const addProjectTopIntentFalsePositive = (pipeline) => {
  const PROJECT = {
    $project: {
      topIntentFalsePositive: 1,
    },
  };
  pipeline.push(PROJECT);
}

const addFacetTopIntentFalsePositive = (pipeline) => {
  const FACET = {
    $facet: {
      falsePositiveIntents: [
        { $match: { topIntentFalsePositive: true } },
        groupAndSum('count')
      ]
    }
  };
  pipeline.push(FACET);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addProjectTopIntentFalsePositive(PIPELINE);
  addFacetTopIntentFalsePositive(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
};
