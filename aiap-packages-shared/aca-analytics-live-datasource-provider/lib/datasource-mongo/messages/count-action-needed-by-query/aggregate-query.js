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
        matchFieldBetween2Dates('created', params),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(params),
        nMatchAttributeByArrayOfPrimitives('userId', params?.query?.nFilter?.userIds),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProjectDialogNodes = (pipeline) => {
  const PROJECT = {
    $project: {
      dialogNodes: 1,
    },
  };
  pipeline.push(PROJECT);
}

const addFacetActionNeeded = (pipeline) => {
  const FACET = {
    $facet: {
      actionNeeded: [
        {
          $match: {
            $or: [
              { dialogNodes: 'Anything else' }
            ]
          }
        },
        groupAndSum('count')
      ]
    }
  };
  pipeline.push(FACET);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(context, params, PIPELINE);
  addProjectDialogNodes(PIPELINE);
  addFacetActionNeeded(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
};
