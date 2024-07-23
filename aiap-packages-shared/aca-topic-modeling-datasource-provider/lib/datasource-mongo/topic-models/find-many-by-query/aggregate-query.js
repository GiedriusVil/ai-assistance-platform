/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const {

  addSortCondition,
  addPagination,
  matchAttributeByRegex
} = require('@ibm-aiap/aiap-utils-mongo');


const _matcher = (params) => {
  const FILTER = params?.query.filter;
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('name', FILTER?.search),
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (params) => {
  const RET_VAL = [];
  RET_VAL.push(_matcher(params));
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
