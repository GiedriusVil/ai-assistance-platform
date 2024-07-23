/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsChartsRoutes = express.Router();

const { liveAnalyticsChartsController } = require('../../controller');

liveAnalyticsChartsRoutes.post('/save-one', liveAnalyticsChartsController.saveOne);
liveAnalyticsChartsRoutes.post('/find-many-by-query', liveAnalyticsChartsController.findManyByQuery);
liveAnalyticsChartsRoutes.post('/find-one-by-id', liveAnalyticsChartsController.findOneById);
liveAnalyticsChartsRoutes.post('/find-one-by-ref', liveAnalyticsChartsController.findOneByRef);
liveAnalyticsChartsRoutes.post('/delete-many-by-ids', liveAnalyticsChartsController.deleteManyByIds);


module.exports = liveAnalyticsChartsRoutes;
