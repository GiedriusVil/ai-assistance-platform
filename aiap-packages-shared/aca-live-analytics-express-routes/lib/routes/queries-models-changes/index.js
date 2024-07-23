/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsQueriesChangesRoutes = express.Router();

const { liveAnalyticsQueriesChangesController } = require('../../controller');

liveAnalyticsQueriesChangesRoutes.post('/find-many-by-query', liveAnalyticsQueriesChangesController.findManyByQuery);
liveAnalyticsQueriesChangesRoutes.post('/find-one-by-id', liveAnalyticsQueriesChangesController.findOneById);

module.exports = liveAnalyticsQueriesChangesRoutes;
