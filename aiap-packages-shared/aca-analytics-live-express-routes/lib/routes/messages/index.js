/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const messagesRouter = express.Router();

const { messagesController } = require('../../controller');

messagesRouter.get('/transfer-totals-group-by-day', messagesController.findTransferTotalsByQueryDayGroups);
messagesRouter.get('/transfer-totals-group-by-hour', messagesController.findTransferTotalsByQueryHourGroups);

module.exports = {
  messagesRouter,
}
