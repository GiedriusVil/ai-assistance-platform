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
  matchAttributeBuyRuleId,
} = require('@ibm-aiap/aiap-utils-mongo');

const _matcher = (params) => {
  const FILTER = ramda.path(['filter'], params);

  const FILTER_RULE_ID = FILTER?.ruleId;
  const FILTER_IDS = FILTER?.ids;
  const FILTER_SEARCH = FILTER?.search;

  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeBuyRuleId(FILTER_RULE_ID),
        {
          $or: [
            matchAttributeByRegex('external.id', FILTER_SEARCH),
            matchAttributeByRegex('external.name', FILTER_SEARCH),
          ]
        },
        _matchAttributeIdByIds(FILTER_IDS),
      ]
    },
  };
  return RET_VAL;
}

const _projections = (params) => {
  const PROJECTIONS = ramda.path(['filter', 'projections'], params);
  if (!lodash.isEmpty(PROJECTIONS)) {
    const RET_VAL = {
      $project: {
        _id: 0,
      },
    };
    const KEYS = Object.keys(PROJECTIONS);
    for (const key of KEYS) {
      RET_VAL.$project[key] = KEYS[key] ? 0 : 1;
    }
    return RET_VAL;
  }
}

const _matchAttributeIdByIds = (ids) => {
  const RET_VAL = {};
  if (
    lodash.isArray(ids) &&
    !lodash.isEmpty(ids)
  ) {
    RET_VAL['_id'] = {
      $in: ids
    };
  }
  return RET_VAL;
}

const aggregateQuery = (params) => {
  const RET_VAL = [
    _matcher(params),
  ];

  const PROJECTIONS = ramda.path(['filter', 'projections'], params);
  if (PROJECTIONS) {
    RET_VAL.push(_projections(params));
  }

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
