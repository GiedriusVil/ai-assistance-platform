/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsTilesRoutes = express.Router();

const { liveAnalyticsTilesController } = require('../../controller');

liveAnalyticsTilesRoutes.post('/save-one', liveAnalyticsTilesController.saveOne);
liveAnalyticsTilesRoutes.post('/find-many-by-query', liveAnalyticsTilesController.findManyByQuery);
liveAnalyticsTilesRoutes.post('/find-one-by-id', liveAnalyticsTilesController.findOneById);
liveAnalyticsTilesRoutes.post('/find-one-by-ref', liveAnalyticsTilesController.findOneByRef);
liveAnalyticsTilesRoutes.post('/delete-many-by-ids', liveAnalyticsTilesController.deleteManyByIds);

module.exports = liveAnalyticsTilesRoutes;
