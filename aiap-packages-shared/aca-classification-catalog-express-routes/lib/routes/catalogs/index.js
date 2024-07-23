/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { catalogsController } = require('../../controllers');

routes.get('/', catalogsController.findManyByQuery);
routes.get('/:id', catalogsController.findOneById);
routes.get('/:id/lite', catalogsController.findLiteOneById);
routes.post('/', catalogsController.saveOne);
routes.post('/search', catalogsController.searchCatalogsByMatch);
routes.put('/:id', catalogsController.saveOne);
routes.post('/delete-many-by-ids', catalogsController.deleteManyByIds);
// routes.delete('/:id', controller.delete);

module.exports = routes;
