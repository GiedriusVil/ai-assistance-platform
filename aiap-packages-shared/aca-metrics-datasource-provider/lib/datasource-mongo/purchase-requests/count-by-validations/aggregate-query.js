/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeBuyerOrganizationIdByIds,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const FILTER = ramda.path(['filter'], params);

  const MATCHER = {
    $match: {
      $and: [
        { 'action': 'RESPONSE_READY' },
        {
          $or: [
            matchFieldBetween2Dates('timestamp', FILTER),
            matchFieldBetween2Dates('created.date', FILTER),
          ]
        },
        matchAttributeBuyerOrganizationIdByIds(FILTER),
        {
          $or: [
            { 'doc.headerValidationResults': { $not: { $size: 0 } } },
            { 'doc.groupValidationResults': { $not: { $size: 0 } } },
            { 'doc.itemValidationResults': { $not: { $size: 0 } } },
          ]
        }
      ]
    }

  };
  pipeline.push(MATCHER);
}

const groupByViolatedRuleId = (pipeline) => {
  const GROUP_BY_RULE_ID = {
    $group: {
      _id: '$violated.data.rule.id',
      count: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP_BY_RULE_ID);
}

const addArrayUnwindToPipeline = (pipeline) => {
  const UNWIND = {
    $unwind: '$violated'
  };
  pipeline.push(UNWIND);
}

const addProjectToPipeline = (pipeline) => {
  const PROJECT_TOTAL = {
    $project: {
      violated: {
        $concatArrays: [
          '$doc.headerValidationResults',
          '$doc.groupValidationResults',
          '$doc.itemValidationResults'
        ]
      }
    }
  };
  pipeline.push(PROJECT_TOTAL);
}

const addLimitParamsToPipeline = (pipeline) => {
  const LIMIT_PARAMS = {
    $limit: 10
  };
  pipeline.push(LIMIT_PARAMS);
}

const addSortingParamsToPipeline = (pipeline) => {
  const SORTING_PARAMS = {
    $sort: {
      count: -1
    }
  };
  pipeline.push(SORTING_PARAMS);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addProjectToPipeline(PIPELINE);
  addArrayUnwindToPipeline(PIPELINE);
  groupByViolatedRuleId(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  addLimitParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
