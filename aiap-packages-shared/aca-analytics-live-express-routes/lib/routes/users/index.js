/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const usersRouter = express.Router();

const { usersController } = require('../../controller');

usersRouter.post('/find-total-users-by-query-month-groups', usersController.findTotalUsersByQueryMonthGroups);
usersRouter.post('/find-new-users-by-query-month-groups', usersController.findNewUsersByQueryMonthGroups);
usersRouter.post('/find-returning-users-by-query-month-groups', usersController.findReturningUsersByQueryMonthGroups);
usersRouter.post('/find-usage-by-country-by-query-month-groups', usersController.findUsageByCountryByQueryMonthGroups);

module.exports = {
  usersRouter,
}
