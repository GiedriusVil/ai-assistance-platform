/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsDashboardsRoutes = express.Router();

const { liveAnalyticsDashboardsController } = require('../../controller');

liveAnalyticsDashboardsRoutes.post('/save-one', liveAnalyticsDashboardsController.saveOne);
liveAnalyticsDashboardsRoutes.post('/find-many-by-query', liveAnalyticsDashboardsController.findManyByQuery);
liveAnalyticsDashboardsRoutes.post('/find-one-by-id', liveAnalyticsDashboardsController.findOneById);
liveAnalyticsDashboardsRoutes.post('/delete-many-by-ids', liveAnalyticsDashboardsController.deleteManyByIds);

module.exports = liveAnalyticsDashboardsRoutes;
