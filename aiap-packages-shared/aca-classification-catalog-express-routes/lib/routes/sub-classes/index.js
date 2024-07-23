/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { subClassesController } = require('../../controllers');

routes.post('/find-many-by-query', subClassesController.findManyByQuery);
routes.post('/', subClassesController.saveOne);
routes.post('/search', subClassesController.searchSubClassesByMatch);
routes.put('/:id', subClassesController.saveOne);
routes.post('/delete-one', subClassesController.deleteOne);

routes.get('/:id', subClassesController.findOneById);
routes.get('/:id/lite', subClassesController.findLiteOneById);

module.exports = routes;
