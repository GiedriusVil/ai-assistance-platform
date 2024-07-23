/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { classesController } = require('../../controllers');

routes.post('/find-many-by-query', classesController.findManyByQuery);

routes.post('/', classesController.saveOne);
routes.post('/search', classesController.searchClassesByMatch);
routes.put('/:id', classesController.saveOne);
routes.post('/delete-one', classesController.deleteOne);

routes.get('/:id', classesController.findOneById);
routes.get('/:id/lite', classesController.findLiteOneById);

module.exports = routes;
