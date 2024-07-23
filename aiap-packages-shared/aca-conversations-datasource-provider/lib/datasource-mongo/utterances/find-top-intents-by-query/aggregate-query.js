/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchAttributeSkill,
  matchAttributeSource,
  matchAttributeMessage,
  matchAttributeAssistantIdByContext,
  matchAttributeAssistantIdByParams,
  matchFieldBetween2Dates,
} = require('@ibm-aiap/aiap-utils-mongo');


const utterancesMatcher = (context, params) => {
  const FILTER = params?.filter;
  const RET_VAL = {
    $match: {
      $and: [
        matchFieldBetween2Dates('timestamp', FILTER),
        matchAttributeAssistantIdByContext(context),
        matchAttributeAssistantIdByParams(FILTER),
        matchAttributeSkill(FILTER),
        matchAttributeSource(FILTER),
        matchAttributeMessage(FILTER),
        {
          topIntent: {
            $exists: true
          }
        }
      ]
    }
  };
  return RET_VAL;
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [
    utterancesMatcher(context, params),
    {
      $project: {
        _id: 0,
        topIntent: 1
      }
    },
    {
      $group: {
        _id: 0,
        intent: {
          $addToSet: '$topIntent'
        }
      }
    },
    {
      $unwind: '$intent'
    },
    {
      $sort: {
        intent: 1
      }
    }
  ];
  return RET_VAL;
};

module.exports = {
  aggregateQuery,
};
