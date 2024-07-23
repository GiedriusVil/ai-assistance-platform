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
  matchAttributeStatus,
} = require('@ibm-aiap/aiap-utils-mongo');

const matchMessageId = (filter) => {
  const MESSAGE_ID = filter?.messageId;

  const RET_VAL = {};
  if (!lodash.isEmpty(MESSAGE_ID)) {
    RET_VAL['message.id'] = {
      $eq: MESSAGE_ID,
    };
  }
  return RET_VAL;
}

const matchByRuleStatus = (status) => {
  let RET_VAL = {};
  if (lodash.isBoolean(status)){
    RET_VAL['status.enabled'] = status;
  }
  return RET_VAL;
}

const matchMessageIds = (filter) => {
  const MESSAGE_IDS = filter?.messageIds;

  const RET_VAL = {};
  if (lodash.isArray(MESSAGE_IDS)) {
    RET_VAL['message.id'] = {
      $in: MESSAGE_IDS,
    };
  }
  return RET_VAL;
}

const matchAttributeBuyerOrganizationIdByIds = (buyerIds) => {
  const RET_VAL = {};
  if (
    lodash.isArray(buyerIds) &&
    !lodash.isEmpty(buyerIds)
  ) {
    RET_VAL['buyer.id'] = {
      $in: buyerIds
    };
  }
  return RET_VAL;
}

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



const _matcher = (params) => {
  const FILTER = ramda.path(['filter'], params);
  const BUYERS = ramda.pathOr([], ['buyerIds'], FILTER);
  const RULE_STATUS = ramda.path(['ruleStatus'], FILTER);
  const RULES_WITH_WARNING = ramda.path(['isRulesWithWarning'], FILTER);
  const SEARCH_CONDITION = ramda.path(['search'], FILTER);
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeBuyerOrganizationIdByIds(BUYERS),
        matchByConfigurationValidity(RULES_WITH_WARNING),
        matchAttributeStatus(FILTER),
        matchMessageId(FILTER),
        matchMessageIds(FILTER),
        matchByRuleStatus(RULE_STATUS),
        {
          $or: [
            matchAttributeByRegex('message.id', SEARCH_CONDITION),
            matchAttributeByRegex('buyer.id', SEARCH_CONDITION),
            matchAttributeByRegex('name', SEARCH_CONDITION),
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
