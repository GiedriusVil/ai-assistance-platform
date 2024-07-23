/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsFiltersRoutes = express.Router();

const { liveAnalyticsFiltersController } = require('../../controller');

liveAnalyticsFiltersRoutes.post('/delete-many-by-ids', liveAnalyticsFiltersController.deleteManyByIds);
liveAnalyticsFiltersRoutes.post('/execute-retrieve-filter-payload', liveAnalyticsFiltersController.executeRetrieveFilterPayload);
liveAnalyticsFiltersRoutes.post('/find-many-by-query', liveAnalyticsFiltersController.findManyByQuery);
liveAnalyticsFiltersRoutes.post('/find-one-by-id', liveAnalyticsFiltersController.findOneById);
liveAnalyticsFiltersRoutes.post('/find-one-by-ref', liveAnalyticsFiltersController.findOneByRef);
liveAnalyticsFiltersRoutes.post('/save-one', liveAnalyticsFiltersController.saveOne);

module.exports = liveAnalyticsFiltersRoutes;
