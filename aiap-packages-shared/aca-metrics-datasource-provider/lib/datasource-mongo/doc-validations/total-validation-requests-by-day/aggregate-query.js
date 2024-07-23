/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const FILTER = ramda.path(['filter'], params);
  const MATCHER = {
    $match: {
      $and: [
        { 'action': 'REQUEST_RECEIVED' },
        {
          $or: [
            matchFieldBetween2Dates('created.date', FILTER),
          ]
        }
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProjectDay = (pipeline) => {
  const PROJECT_DAY = {
    $project: {
      _id: 0,
      ruleType: 1,
      day: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$created.date'
        }
      }
    }
  };
  pipeline.push(PROJECT_DAY);
}

const addGroupByRuleTypeAndDay = (pipeline) => {
  const GROUP_BY_RULE_TYPE_AND_DAY = {
    $group: {
      _id: {
        ruleType: '$ruleType',
        day: '$day'
      },
      total: {
        $sum: 1
      }
    }
  };
  pipeline.push(GROUP_BY_RULE_TYPE_AND_DAY);
}

const addGroupByRuleType = (pipeline) => {
  const GROUP_BY_RULE_TYPE = {
    $group: {
      _id: '$_id.ruleType',
      requests: {
        $push: {
          day: '$_id.day',
          total: '$total'
        }
      }
    }
  }
  pipeline.push(GROUP_BY_RULE_TYPE);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addProjectDay(PIPELINE);
  addGroupByRuleTypeAndDay(PIPELINE);
  addGroupByRuleType(PIPELINE);

  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
