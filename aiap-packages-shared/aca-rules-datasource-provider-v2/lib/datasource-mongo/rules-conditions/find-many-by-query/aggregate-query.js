/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
  matchByAttribute,
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (params, pipeline) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;
  const RULE_ID = params?.filter?.ruleId;

  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByRegex('path.value', FILTER_SEARCH),
            matchAttributeByRegex('operator.type', FILTER_SEARCH),
            matchAttributeByRegex('value', FILTER_SEARCH),
          ]
        },
        matchByAttribute('ruleId', RULE_ID),
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
