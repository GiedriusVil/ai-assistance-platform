/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const stopWatchMetricsRouter = express.Router();

const { stopWatchMetricsController } = require('../../controller');

stopWatchMetricsRouter.post('/save-one', stopWatchMetricsController.saveOne);
stopWatchMetricsRouter.post('/find-many-by-query', stopWatchMetricsController.findManyByQuery);
stopWatchMetricsRouter.post('/find-one-by-id', stopWatchMetricsController.findOneById);
stopWatchMetricsRouter.post('/delete-many-by-ids', stopWatchMetricsController.deleteManyByIds);


module.exports = stopWatchMetricsRouter
