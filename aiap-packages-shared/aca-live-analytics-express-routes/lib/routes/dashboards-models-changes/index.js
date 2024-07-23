/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsDashboardsChangesRoutes = express.Router();

const { liveAnalyticsDashboardsChangesController } = require('../../controller');

liveAnalyticsDashboardsChangesRoutes.post('/find-many-by-query', liveAnalyticsDashboardsChangesController.findManyByQuery);
liveAnalyticsDashboardsChangesRoutes.post('/find-one-by-id', liveAnalyticsDashboardsChangesController.findOneById);

module.exports = liveAnalyticsDashboardsChangesRoutes;
