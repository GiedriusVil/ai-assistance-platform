/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsFiltersChangesRoutes = express.Router();

const { liveAnalyticsFiltersChangesController } = require('../../controller');

liveAnalyticsFiltersChangesRoutes.post('/find-many-by-query', liveAnalyticsFiltersChangesController.findManyByQuery);
liveAnalyticsFiltersChangesRoutes.post('/find-one-by-id', liveAnalyticsFiltersChangesController.findOneById);

module.exports = liveAnalyticsFiltersChangesRoutes;
