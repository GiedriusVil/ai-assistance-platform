/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const _addMatchersToPipeline = (params, pipeline) => {
  const SEARCH_CONDITION = params?.filter?.search;
  const MATCHERS = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByRegex('_id', SEARCH_CONDITION),
            matchAttributeByRegex('name', SEARCH_CONDITION),
            matchAttributeByRegex('external.id', SEARCH_CONDITION),
          ]
        }
      ]
    },
  };

  pipeline.push(MATCHERS);
};

const _addFacetToPipeline = (params, pipeline) => {
  const FACET = {
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params),
      ],
      total: [
        {
          $count: 'count',
        }
      ]
    }
  };

  pipeline.push(FACET);
};

const _addSetToPipeline = (params, pipeline) => {
  const SET = {
    $set: { tempTotal: { $arrayElemAt: ['$total', 0] } }
  };

  pipeline.push(SET);
};

const _addProjectToPipeline = (params, pipeline) => {
  const PROJECT = {
    $project: {
      items: {
        _id: 1,
        name: 1,
        external: {
          id: 1
        },
      },
      total: { $ifNull: ['$tempTotal.count', 0] },
    }
  };

  pipeline.push(PROJECT);
};

const aggregateQuery = (params) => {
  const RET_VAL = [];

  _addMatchersToPipeline(params, RET_VAL);
  _addFacetToPipeline(params, RET_VAL);
  _addSetToPipeline(params, RET_VAL);
  _addProjectToPipeline(params, RET_VAL);

  return RET_VAL;
};

module.exports = {
  aggregateQuery,
};
