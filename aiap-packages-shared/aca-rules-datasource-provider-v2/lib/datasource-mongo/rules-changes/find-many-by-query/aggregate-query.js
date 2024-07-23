/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
  matchFieldBetween2Dates,
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (pipeline, params) => {
  const MATCHER = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created.date', params?.filter),
        {
          $or: [
            matchAttributeByRegex('ruleKey', params?.filter?.search),
            matchAttributeByRegex('created.user.id', params?.filter?.search),
            matchAttributeByRegex('created.user.name', params?.filter?.search),
          ],
        },
      ],
    },
  };
  pipeline.push(MATCHER);
}

const addFacetTotalItems = (pipeline, params) => {
  const FACET = {
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params),
      ],
      total: [
        {
          $count: 'count',
        },
      ],
    },
  };
  pipeline.push(FACET);
}

const addSetTotal = (pipeline) => {
  const SET = {
    $set: {
      tempTotal: {
        $arrayElemAt: ['$total', 0],
      },
    },
  };
  pipeline.push(SET);
}

const addProjectTotalItems = (pipeline) => {
  const PROJECT = {
    $project: {
      items: 1,
      total: { $ifNull: ['$tempTotal.count', 0] },
    },
  };
  pipeline.push(PROJECT);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(PIPELINE, params);
  addFacetTotalItems(PIPELINE, params);
  addSetTotal(PIPELINE);
  addProjectTotalItems(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
