/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const { findTransferTotalsByQueryDayGroups } = require('./find-transfer-totals-by-query-day-groups');
const { findTransferTotalsByQueryHourGroups } = require('./find-transfer-totals-by-query-hour-groups');


module.exports = {
  findTransferTotalsByQueryDayGroups,
  findTransferTotalsByQueryHourGroups
} 
