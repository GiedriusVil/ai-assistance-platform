/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  projectField$DateToString,
  matchAttributeBuyerOrganizationIdByIds,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const FILTER = ramda.path(['filter'], params);
  const MATCHER = {
    $match: {
      $and: [
        { 'action': 'REQUEST_RECEIVED' },
        {
          $or: [
            matchFieldBetween2Dates('timestamp', FILTER),
            matchFieldBetween2Dates('created.date', FILTER),
          ]
        },
        matchAttributeBuyerOrganizationIdByIds(FILTER),
      ]
    },
  };
  pipeline.push(MATCHER);
}

const addProjectToTimestampToPipeline = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      timestamp: {
        $ifNull: ['$timestamp', '$created.date']
      },
    }
  };
  pipeline.push(PROJECT);
}

const addProjectToDayToPipeline = (context, params, pipeline) => {
  const PROJECT = {
    $project: {
      _id: 0,
      day: projectField$DateToString(context.user.timezone, '%Y-%m-%d', '$timestamp'),
    }
  };
  pipeline.push(PROJECT);
}

const addGroupByDayToPipeline = (pipeline) => {
  const GROUP_BY_DAY = {
    $group: {
      _id: '$day',
      total: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP_BY_DAY);
}

const addFinalProjectToPipeline = (pipeline) => {
  const PROJECT_TOTAL = {
    $project: {
      _id: 0,
      day: '$_id',
      total: 1
    }
  };
  pipeline.push(PROJECT_TOTAL);
}

const addSortingParamsToPipeline = (pipeline) => {
  const SORTING_PARAMS = {
    $sort: { day: 1 }
  };
  pipeline.push(SORTING_PARAMS);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addProjectToTimestampToPipeline(context, params, PIPELINE);
  addProjectToDayToPipeline(context, params, PIPELINE);
  addGroupByDayToPipeline(PIPELINE);
  addFinalProjectToPipeline(PIPELINE);
  addSortingParamsToPipeline(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
