/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const conversationsRouter = express.Router();

const { conversationsController } = require('../../controller');

conversationsRouter.post('/group-by-month', conversationsController.findByQueryMonthGroups);
conversationsRouter.post('/group-by-day', conversationsController.findByQueryDayGroups);
conversationsRouter.post('/group-by-hour', conversationsController.findByQueryHourGroups);

conversationsRouter.post('/avg-duration-group-by-day', conversationsController.findAvgDurationByQueryDayGroups);
conversationsRouter.post('/avg-duration-group-by-hour', conversationsController.findAvgDurationByQueryHourGroups);

conversationsRouter.post('/with-user-interaction-group-by-day', conversationsController.findWithUserInteractionDayGroups);
conversationsRouter.post('/with-user-interaction-group-by-hour', conversationsController.findWithUserInteractionHourGroups);

conversationsRouter.post('/find-channel-users-by-query-month-groups', conversationsController.findChannelUsersByQueryMonthGroups);
module.exports = {
  conversationsRouter,
}
