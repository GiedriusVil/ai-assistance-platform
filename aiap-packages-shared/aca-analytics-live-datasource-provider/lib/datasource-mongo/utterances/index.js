/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { avgPerConversationByQuery } = require('./avg-per-conversation-by-query');
const { avgPerConversationByQueryDayGroups } = require('./avg-per-conversation-by-query-day-groups');
const { avgPerConversationByQueryHourGroups } = require('./avg-per-conversation-by-query-hour-groups');

const { countByQueryActionNeeded } = require('./count-action-needed-by-query');
const { countByQuery } = require('./count-by-query');
const { countByQueryAiSkillGroups } = require('./count-by-query-ai-skill-groups');
const { countByQueryDayGroups } = require('./count-by-query-day-groups');
const { countByQueryHourGroups } = require('./count-by-query-hour-groups');
const { countByQueryFalsePositive } = require('./count-false-positive-by-query');
const { countTransfersByQuery } = require('./count-transfers-by-query');

const { findLastIntentsByQuery } = require('./find-last-intents-by-query');
const { findLowConfidenceIntentsByQuery } = require('./find-low-confidence-intents-by-query');
const { findNegTopIntentsByQuery } = require('./find-neg-top-intents-by-query');
const { findTopIntentsByQuery } = require('./find-top-intents-by-query');
const { findTransferIntentsByQuery } = require('./find-transfer-intents-by-query');
const { findTransferTotalsByQueryDayGroups } = require('./find-transfer-totals-by-query-day-groups');
const { findTransferTotalsByQueryHourGroups } = require('./find-transfer-totals-by-query-hour-groups');
const { findResponseConfidenceByQueryMonthGroups } = require('./find-response-confidence-by-query-month-groups');
const { findResponseConfidenceTargetMonthGroups } = require('./find-response-confidence-target-month-groups');
const { findUsersPersonaByQueryMonthGroups } = require('./find-users-persona-by-query-month-groups');

const { findChatsByQueryMonthGroups } = require('./find-chats-by-query-month-groups');
const { findTicketsByQueryMonthGroups } = require('./find-tickets-by-query-month-groups');
const { findChatsTicketsByQueryMonthGroups } = require('./find-chats-tickets-by-query-month-groups');
const { findZendeskPOPChatsByQueryMonthGroups } = require('./find-zendesk-pop-chats-by-query-month-groups');
const { findZendeskPOPTicketsByQueryMonthGroups } = require('./find-zendesk-pop-tickets-by-query-month-groups');
const { findZendeskPSISTicketsByQueryMonthGroups } = require('./find-zendesk-psis-tickets-by-query-month-groups');
const { findZendeskPOPChatsTicketsPSISTicketsByQueryMonthGroups } = require('./find-zendesk-pop-chats-tickets-psis-tickets-by-query-month-groups');

module.exports = {
  avgPerConversationByQuery,
  avgPerConversationByQueryDayGroups,
  avgPerConversationByQueryHourGroups,
  countByQueryActionNeeded,
  countByQuery,
  countByQueryAiSkillGroups,
  countByQueryDayGroups,
  countByQueryHourGroups,
  countByQueryFalsePositive,
  countTransfersByQuery,
  findLastIntentsByQuery,
  findLowConfidenceIntentsByQuery,
  findNegTopIntentsByQuery,
  findTopIntentsByQuery,
  findTransferIntentsByQuery,
  findTransferTotalsByQueryDayGroups,
  findTransferTotalsByQueryHourGroups,
  findResponseConfidenceByQueryMonthGroups,
  findResponseConfidenceTargetMonthGroups,
  findChatsByQueryMonthGroups,
  findTicketsByQueryMonthGroups,
  findChatsTicketsByQueryMonthGroups,
  findZendeskPOPChatsByQueryMonthGroups,
  findZendeskPOPTicketsByQueryMonthGroups,
  findZendeskPSISTicketsByQueryMonthGroups,
  findZendeskPOPChatsTicketsPSISTicketsByQueryMonthGroups,
  findUsersPersonaByQueryMonthGroups
}
