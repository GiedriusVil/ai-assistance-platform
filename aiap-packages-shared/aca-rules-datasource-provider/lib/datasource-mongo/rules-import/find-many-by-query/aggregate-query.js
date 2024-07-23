/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex,
} = require('@ibm-aiap/aiap-utils-mongo');

const matchByConfigurationValidity = (warning) => {
  let retVal = {};
  if (warning) {
    retVal = {
      $or: [
        { 'status.selectedMessageExists': false },
        { 'status.selectedBuyerExists': false },
      ]
    };
  }
  return retVal;
}

// At this moment not used - include later...
const _matcher = (params) => {

  const RULE_ID = ramda.path(['filter', 'ruleId'], params);
  const RULES_WITH_WARNING = ramda.path(['filter', 'isRulesWithWarning'], params);

  const RET_VAL = {
    $match: {
      $and: [
        matchByConfigurationValidity(RULES_WITH_WARNING),
        {
          $or: [
            matchAttributeByRegex('buyer.id', RULE_ID),
            matchAttributeByRegex('name', RULE_ID),

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
