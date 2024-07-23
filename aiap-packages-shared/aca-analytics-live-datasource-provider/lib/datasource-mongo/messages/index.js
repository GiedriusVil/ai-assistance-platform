/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { countByQuery } = require('./count-by-query');
const { avgPerConversationByQuery } = require('./avg-per-conversation-by-query');
const { countByQueryActionNeeded } = require('./count-action-needed-by-query');
const { countByQueryFalsePositive } = require('./count-false-positive-by-query');
const { findTransferTotalsByQueryDayGroups } = require('./find-transfer-totals-by-query-day-groups');
const { findTransferTotalsByQueryHourGroups } = require('./find-transfer-totals-by-query-hour-groups');

module.exports = {
  countByQuery,
  avgPerConversationByQuery,
  countByQueryActionNeeded,
  countByQueryFalsePositive,
  findTransferTotalsByQueryDayGroups,
  findTransferTotalsByQueryHourGroups
}
