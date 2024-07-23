/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
  matchAttributeByArrayOfPrimitives
} = require('@ibm-aiap/aiap-utils-mongo');

const _matcher = (params) => {
  const FILTER = params?.filter;
  const FILTER_SEARCH = FILTER?.search;
  const IDS = params?.ids;
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('_id', FILTER_SEARCH),
        matchAttributeByArrayOfPrimitives('_id', IDS),
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [
    _matcher(params)
  ];
  RET_VAL.push({
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
  });
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
  aggregateQuery,
}
