/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  addSortCondition,
  addPagination,
  matchFieldBetween2Dates,
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const _matcher = (context, params) => {
  const FILTER = ramda.path(['filter'], params);
  const FILTER_SEARCH = ramda.path(['search'], FILTER);
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchFieldBetween2Dates('timestamp', FILTER),
            matchFieldBetween2Dates('created.date', FILTER),
          ]
        },
        {
          $or: [
            matchAttributeByRegex('docId', FILTER_SEARCH),
            matchAttributeByRegex('docType', FILTER_SEARCH),
            matchAttributeByRegex('action', FILTER_SEARCH),
            matchAttributeByRegex('docNumber', FILTER_SEARCH),
          ]
        }
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [
    _matcher(context, params),
  ];
  RET_VAL.push({
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
