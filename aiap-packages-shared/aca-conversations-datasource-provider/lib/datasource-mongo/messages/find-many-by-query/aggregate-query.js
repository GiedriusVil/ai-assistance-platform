/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  matchAttributeConversationId,
  matchAttributeAssistantIdByContext,
  matchAttributeSlackMessageId,
  matchAttributeMsTeamsMessageId,
  addSortCondition,
  addPagination,
} = require('@ibm-aiap/aiap-utils-mongo');

const messagesMatcher = (context, params) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeAssistantIdByContext(context),
        matchAttributeConversationId(params),
        matchAttributeSlackMessageId(params),
        matchAttributeMsTeamsMessageId(params),
      ]
    },
  };

  if (
    !params.systemMessages
  ) {
    RET_VAL.$match.$and.push({
      'attachment.type': {
        $nin: ['ACA_DEBUG', 'ACA_ERROR']
      }
    })
  }

  return RET_VAL;
}

const aggregateQuery = (context, params) => {
  const RET_VAL = [
    messagesMatcher(context, params),
    {
      $facet: {
        messages: [
          ...addSortCondition(params),
          ...addPagination(params),
        ],
        total: [
          {
            $count: 'count',
          }
        ]
      }
    }
  ];
  return RET_VAL;
}

module.exports = {
  aggregateQuery,
}
