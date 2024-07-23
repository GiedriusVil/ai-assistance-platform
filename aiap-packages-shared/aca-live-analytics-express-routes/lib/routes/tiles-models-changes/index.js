/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsTilesChangesRoutes = express.Router();

const { liveAnalyticsTilesChangesController } = require('../../controller');

liveAnalyticsTilesChangesRoutes.post('/find-many-by-query', liveAnalyticsTilesChangesController.findManyByQuery);
liveAnalyticsTilesChangesRoutes.post('/find-one-by-id', liveAnalyticsTilesChangesController.findOneById);

module.exports = liveAnalyticsTilesChangesRoutes;
