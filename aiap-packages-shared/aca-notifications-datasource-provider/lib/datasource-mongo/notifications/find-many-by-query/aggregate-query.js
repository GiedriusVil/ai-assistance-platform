/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex
} = require('@ibm-aiap/aiap-utils-mongo');

const _matchReceiverIds = (params) => {
  const RECEIVERS = ramda.path(['filter', 'receivers'], params);

  const RET_VAL = {};
  if (!lodash.isEmpty(RECEIVERS)) {
    RET_VAL.receiver = {
      $in: RECEIVERS
    };
  }
  return RET_VAL;
}

// At this moment not used - include later...
const _matcher = (params) => {
  const SEARCH = ramda.path(['filter', 'search'], params);

  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByRegex('_id', SEARCH),
            matchAttributeByRegex('receiver', SEARCH),
          ]
        },
        _matchReceiverIds(params)
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
