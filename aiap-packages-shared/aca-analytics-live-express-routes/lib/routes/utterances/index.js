/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const utterancesRouter = express.Router();

const { utterancesController } = require('../../controller');

utterancesRouter.post('/top-intents-by-query', utterancesController.findTopIntentsByQuery);
utterancesRouter.post('/neg-top-intents-by-query', utterancesController.findNegTopIntentsByQuery);
utterancesRouter.post('/low-confidence-intents-by-query', utterancesController.findLowConfidenceIntentsByQuery);
utterancesRouter.post('/transfer-intents-by-query', utterancesController.findTransferIntentsByQuery);

utterancesRouter.post('/transfer-totals-group-by-day', utterancesController.findTransferTotalsByQueryDayGroups);
utterancesRouter.post('/transfer-totals-group-by-hour', utterancesController.findTransferTotalsByQueryHourGroups);

utterancesRouter.post('/count-by-query-group-by-ai-skill', utterancesController.countByQueryAiSkillGroups);
utterancesRouter.post('/count-by-query-group-by-day', utterancesController.countByQueryDayGroups);
utterancesRouter.post('/count-by-query-group-by-hour', utterancesController.countByQueryHourGroups);

utterancesRouter.post('/avg-per-conversation-by-query-group-by-day', utterancesController.avgPerConversationByQueryDayGroups);
utterancesRouter.post('/avg-per-conversation-by-query-group-by-hour', utterancesController.avgPerConversationByQueryHourGroups);

utterancesRouter.post('/find-response-confidence-by-query-month-groups', utterancesController.findResponseConfidenceByQueryMonthGroups);
utterancesRouter.post('/find-response-confidence-target-month-groups', utterancesController.findResponseConfidenceTargetMonthGroups);
utterancesRouter.post('/find-users-persona-by-query-month-groups', utterancesController.findUsersPersonaByQueryMonthGroups);

utterancesRouter.post('/find-chats-by-query-month-groups', utterancesController.findChatsByQueryMonthGroups);
utterancesRouter.post('/find-tickets-by-query-month-groups', utterancesController.findTicketsByQueryMonthGroups);
utterancesRouter.post('/find-chats-tickets-by-query-month-groups', utterancesController.findChatsTicketsByQueryMonthGroups);
utterancesRouter.post('/find-zendesk-pop-chats-by-query-month-groups', utterancesController.findZendeskPOPChatsByQueryMonthGroups);
utterancesRouter.post('/find-zendesk-pop-tickets-by-query-month-groups', utterancesController.findZendeskPOPTicketsByQueryMonthGroups);
utterancesRouter.post('/find-zendesk-psis-tickets-by-query-month-groups', utterancesController.findZendeskPSISTicketsByQueryMonthGroups);
utterancesRouter.post('/find-zendesk-pop-chats-tickets-psis-tickets-by-query-month-groups', utterancesController.findZendeskPOPChatsTicketsPSISTicketsByQueryMonthGroups);

module.exports = {
  utterancesRouter,
}
