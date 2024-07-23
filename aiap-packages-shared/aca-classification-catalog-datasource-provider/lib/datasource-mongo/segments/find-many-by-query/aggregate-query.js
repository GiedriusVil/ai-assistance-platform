/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
  matchFieldByExactValue,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const _matcher = (params) => {
  const FILTER = ramda.path(['filter'], params);
  const FILTER_OPTIONS = ramda.path(['filterOptions'], params);
  const FILTER_SEARCH = ramda.path(['search'], FILTER);

  const RET_VAL = {
    $match: {
      $and: [
        matchFieldByExactValue('catalogId', FILTER, FILTER_OPTIONS),
        {
          $or: [
            matchAttributeByRegex('code', FILTER_SEARCH),
            matchAttributeByRegex('title.en', FILTER_SEARCH),
          ]
        }
      ]
    },
  };
  return RET_VAL;
}


const aggregateQuery = (params) => {
  const RET_VAL = [
    _matcher(params),
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
