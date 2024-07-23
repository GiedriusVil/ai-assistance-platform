/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const usageByGroupRouter = express.Router();

const { usageByGroupController } = require('../../controller');

usageByGroupRouter.post('/find-connect-to-agent-by-query-month-groups', usageByGroupController.findConnectToAgentByQueryMonthGroups);
usageByGroupRouter.post('/find-goods-requests-by-query-month-groups', usageByGroupController.findGoodsRequestsByQueryMonthGroups);
usageByGroupRouter.post('/find-accounting-by-query-month-groups', usageByGroupController.findAccountingByQueryMonthGroups);
usageByGroupRouter.post('/find-approver-flow-by-query-month-groups', usageByGroupController.findApproverFlowByQueryMonthGroups);
usageByGroupRouter.post('/find-error-message-by-query-month-groups', usageByGroupController.findErrorMessageByQueryMonthGroups);
usageByGroupRouter.post('/find-buyer-information-by-query-month-groups', usageByGroupController.findBuyerInformationByQueryMonthGroups);

module.exports = {
  usageByGroupRouter,
}
