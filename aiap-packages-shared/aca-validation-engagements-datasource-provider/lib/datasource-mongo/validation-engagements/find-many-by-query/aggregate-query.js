/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (params, pipeline) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;

  const MATCHER = {
    $match: {
      $and: [
        matchAttributeByRegex('_id', FILTER_SEARCH),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addFacetTotalItemsToPipeline = (params, pipeline) => {
  const FACET = {
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params)
      ],
      total: [
        {
          $count: 'count',
        }
      ]
    }
  };
  pipeline.push(FACET);
}

const addSetTotalToPipeline = (pipeline) => {
  const SET = {
    $set: {
      tempTotal: {
        $arrayElemAt: ['$total', 0],
      }
    }
  };
  pipeline.push(SET);
}

const addProjectItemsToPipeline = (pipeline) => {
  const PROJECT = {
    $project: {
      items: 1,
      total: { $ifNull: ['$tempTotal.count', 0] },
    }
  };
  pipeline.push(PROJECT);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addMatcherToPipeline(params, PIPELINE);
  addFacetTotalItemsToPipeline(params, PIPELINE);
  addSetTotalToPipeline(PIPELINE);
  addProjectItemsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
