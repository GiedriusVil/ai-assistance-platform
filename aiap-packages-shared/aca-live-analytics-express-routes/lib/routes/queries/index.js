/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsQueriesRoutes = express.Router();

const { liveAnalyticsQueriesController } = require('../../controller');

liveAnalyticsQueriesRoutes.post('/compile-one', liveAnalyticsQueriesController.compileOne);
liveAnalyticsQueriesRoutes.post('/delete-many-by-ids', liveAnalyticsQueriesController.deleteManyByIds);
liveAnalyticsQueriesRoutes.post('/execute-one', liveAnalyticsQueriesController.executeOne);
liveAnalyticsQueriesRoutes.post('/find-many-by-query', liveAnalyticsQueriesController.findManyByQuery);
liveAnalyticsQueriesRoutes.post('/find-one-by-id', liveAnalyticsQueriesController.findOneById);
liveAnalyticsQueriesRoutes.post('/find-one-by-ref', liveAnalyticsQueriesController.findOneByRef);
liveAnalyticsQueriesRoutes.post('/save-one', liveAnalyticsQueriesController.saveOne);

module.exports = liveAnalyticsQueriesRoutes;
