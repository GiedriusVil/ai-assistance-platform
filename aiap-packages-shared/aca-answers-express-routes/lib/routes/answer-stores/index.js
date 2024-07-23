/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { answerStoresController } = require('../../controllers');

routes.get('/', answerStoresController.findManyByQuery);
routes.post('/find-many-lite-by-query', answerStoresController.findManyLiteByQuery);
routes.post('/find-one-lite-by-id', answerStoresController.findOneLiteById);
routes.get('/pull-options', answerStoresController.retrievePullOptions);
routes.post('/:answerStoreId/pull-one', answerStoresController.pullOne);
routes.post('/pull-many-by-ids', answerStoresController.pullManyByIds);
routes.post('/', answerStoresController.saveOne);
routes.post('/delete-many-by-ids', answerStoresController.deleteManyByIds);

module.exports = routes;
