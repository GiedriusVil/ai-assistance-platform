/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (params, pipeline) => {
  const FILTER_SEARCH = params?.filter?.search;
  const ENGAGEMENT_ID = params?.query?.filter?.engagement?.id;

  let orMatchers = [
    matchAttributeByRegex('id', FILTER_SEARCH),
    matchAttributeByRegex('key', FILTER_SEARCH),
    matchAttributeByRegex('name', FILTER_SEARCH),
    matchAttributeByRegex('engagement.key', FILTER_SEARCH),
    matchAttributeByRegex('engagement.id', ENGAGEMENT_ID),
  ];

  orMatchers = orMatchers.filter((item) => {
    const RET_VAL = !lodash.isEmpty(item)
    return RET_VAL;
  });

  if (lodash.isEmpty(orMatchers)) {
    return;
  }

  const MATCHER = {
    $match: {
      $or: orMatchers
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
