/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsHealthCheckRouter = express.Router();

const { liveAnalyticsHealthCheckController } = require('../../controller');

liveAnalyticsHealthCheckRouter.post('/compile-query', liveAnalyticsHealthCheckController.compileQuery);

module.exports = liveAnalyticsHealthCheckRouter;
