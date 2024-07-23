/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  nMatchByAttributesArray,
  addSortCondition,
  addPagination
} = require('@ibm-aiap/aiap-utils-mongo');

const addMatcherToPipeline = (params, pipeline) => {
  const MATCHER = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('lastVisitTimestamp', params),
          ]
        },
      ],
      $or: nMatchByAttributesArray(params?.attribute?.maskingText, params?.attribute?.fieldsToMask)
    },
  };
  pipeline.push(MATCHER);
};

const addFacetToPipeline = (params, pipeline) => {
  const FACET = {
    $facet: {
      users: [
        ...addSortCondition(params),
        ...addPagination(params),
      ],
      total: [
        {
          $count: 'count',
        },
      ]
    }
  };
  pipeline.push(FACET);
};

const aggregatePipeline = (params) => {
  const PIPELINE = [];
  addMatcherToPipeline(params, PIPELINE);
  addFacetToPipeline(params, PIPELINE);
  return PIPELINE;
};

module.exports = {
  aggregatePipeline,
};
