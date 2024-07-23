/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchAttributeByRegex,
  addSortCondition,
  addPagination,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const _matcher = (params) => {
  const FILTER = ramda.path(['filter'], params);
  const FILTER_SEARCH = ramda.path(['search'], FILTER);
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('_id', FILTER_SEARCH),
      ]
    },
  };
  return RET_VAL;
}

const setTotal = () => {
  const RET_VAL = {
    $set: { tempTotal: { $arrayElemAt: ['$total', 0] } },
  };
  return RET_VAL;
}

const projectTotal = () => {
  const RET_VAL = {
    $project: {
      items: 1,
      total: { $ifNull: ['$tempTotal.count', 0] },
    }
  };
  return RET_VAL;
}

const facetFindManyByQuery = (params) => {
  const RET_VAL = {
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params),
      ],
      total: [
        {
          $count: 'count',
        },
      ]
    },
  };
  return RET_VAL;
}
const aggregateQuery = (context, params) => {
  const RET_VAL = [
    _matcher(params),
    facetFindManyByQuery(params),
    setTotal(),
    projectTotal(),
  ];
  return RET_VAL;
}

module.exports = {
  aggregateQuery,
}
