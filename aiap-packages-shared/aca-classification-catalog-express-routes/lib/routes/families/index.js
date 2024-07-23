/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { familiesController } = require('../../controllers');

routes.post('/find-many-by-query', familiesController.findManyByQuery);
routes.post('/delete-one', familiesController.deleteOne);
routes.post('/search', familiesController.searchFamiliesByMatch);
routes.post('/', familiesController.saveOne);

routes.put('/:id', familiesController.saveOne);

routes.get('/:id', familiesController.findOneById);
routes.get('/:id/lite', familiesController.findLiteOneById);


module.exports = routes;
