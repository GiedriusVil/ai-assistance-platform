/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  addSortCondition,
  addPagination,
  matchAttributeByRegex
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const _matcher = (params) => {
  const FILTER = ramda.path(['filter'], params);
  const FILTER_SEARCH = ramda.path(['search'], FILTER);
  const RET_VAL = {
    $match: {
      $and: [
        matchFieldBetween2Dates('created', params),
        matchAttributeByRegex('modelId', params.modelId),
        {
          $or: [
            matchAttributeByRegex('_id', FILTER_SEARCH),
            matchAttributeByRegex('name', FILTER_SEARCH),
          ]
        }
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
