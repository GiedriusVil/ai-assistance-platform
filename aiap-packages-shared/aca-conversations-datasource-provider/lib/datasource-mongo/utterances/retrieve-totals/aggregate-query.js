/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchFieldBetween2Dates,
  matchAttributeSkill,
  matchAttributeSource,
  matchAttributeTopIntent,
  matchAttributeMessage,
  matchAttributeAssistantIdByContext,
  matchAttributeAssistantIdByParams,
  groupAndSum
} = require('@ibm-aiap/aiap-utils-mongo');

const aggregateQuery = (context, params) => {
  const FILTER = params?.filter;
  const RET_VAL = [
    {
      $match: {
        $and: [
          matchFieldBetween2Dates('timestamp', FILTER),
          matchAttributeAssistantIdByContext(context),
          matchAttributeAssistantIdByParams(FILTER),
          matchAttributeSkill(FILTER),
          matchAttributeSource(params),
          matchAttributeTopIntent(FILTER),
          matchAttributeMessage(FILTER),
        ],
      },
    },
    {
      $project: {
        intent: '$topIntent',
        intentScore: '$topIntentScore',
        dialogNodes: 1,
        status: 1,
        type: 1,
        topIntentFalsePositive: 1,
      },
    },
    {
      $facet: {
        allUtterances: [
          groupAndSum('count')
        ],
        falsePositiveIntents: [
          { $match: { topIntentFalsePositive: true } },
          groupAndSum('count')
        ],
        positiveFeedback: [
          { $match: { _id: { $in: params.positiveFeedbackIds } } },
          groupAndSum('count')
        ],
        negativeFeedback: [
          { $match: { _id: { $in: params.negativeFeedbackIds } } },
          groupAndSum('count')
        ],
        actionNeeded: [
          {
            $match: {
              $or: [
                { dialogNodes: 'Anything else' }
              ]
            }
          },
          groupAndSum('count')
        ]
      }
    }
  ];
  return RET_VAL;
}

module.exports = {
  aggregateQuery,
};
