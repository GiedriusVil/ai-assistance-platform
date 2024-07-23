/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeBuyerOrganizationIdByIds,
} = require('@ibm-aiap/aiap-utils-mongo');

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const addParamsMatchToFilter = (context, params, pipeline) => {
  const FILTER = ramda.path(['filter'], params);
  const MATCHER = {
    $match: {
      $and: [
        { action: 'RESPONSE_TRANSFORMED' },
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

const addGroupByBuyerAndValidationsCount = (pipeline) => {
  const GROUP_BY_BUYER_AND_VALIDATIONS_COUNT = {
    $group: {
      _id: {
        'PR': '$doc.documentId',
        'buyer': '$context.user.session.organization.id',
      },
      count: {
        $sum: 1
      }
    }
  }
  pipeline.push(GROUP_BY_BUYER_AND_VALIDATIONS_COUNT);
}

const addProjectToFrequencyRanges = (pipeline) => {
  const PROJECT_INTO_FREQUENCY_RANGES = {
    $project: {
      '_id': 0,
      'buyer': '$_id.buyer',
      'PR': '$_id.PR',
      'count': '$count',
      'range': {
        $switch:
        {
          branches: [
            {
              case: { $eq: ['$count', 1] },
              then: 'one'
            },
            {
              case: {
                $and: [{ $gte: ['$count', 1] },
                { $lte: ['$count', 5] }]
              },
              then: 'low'
            },
            {
              case: {
                $and: [{ $gte: ['$count', 5] },
                { $lte: ['$count', 10] }]
              },
              then: 'mid'
            },
          ],
          default: 'inf'
        }
      }
    }
  };
  pipeline.push(PROJECT_INTO_FREQUENCY_RANGES);
}

const addGroupByFrequencyRanges = (pipeline) => {
  const GROUP_BY_FREQUENCY_RANGES = {
    $group: {
      '_id': {
        'buyer': '$buyer',
        'range': '$range',
      },
      'count': {
        $sum: 1
      }
    }
  };
  pipeline.push(GROUP_BY_FREQUENCY_RANGES);
}

const addGroupByBuyer = (pipeline) => {
  const GROUP_BY_BUYER = {
    $group: {
      '_id': '$_id.buyer',
      'ranges': {
        $addToSet: {
          'range': '$_id.range',
          'count': '$count'
        }
      }
    }
  };
  pipeline.push(GROUP_BY_BUYER);
}

const aggregateQuery = (context, params) => {
  const PIPELINE = [];
  addParamsMatchToFilter(context, params, PIPELINE);
  addGroupByBuyerAndValidationsCount(PIPELINE);
  addProjectToFrequencyRanges(PIPELINE);
  addGroupByFrequencyRanges(PIPELINE);
  addGroupByBuyer(PIPELINE);
  return PIPELINE;
}

module.exports = {
  aggregateQuery,
}
