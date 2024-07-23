/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsChartsChangesRoutes = express.Router();

const { liveAnalyticsChartsChangesController } = require('../../controller');

liveAnalyticsChartsChangesRoutes.post('/find-many-by-query', liveAnalyticsChartsChangesController.findManyByQuery);
liveAnalyticsChartsChangesRoutes.post('/find-one-by-id', liveAnalyticsChartsChangesController.findOneById);

module.exports = liveAnalyticsChartsChangesRoutes;
