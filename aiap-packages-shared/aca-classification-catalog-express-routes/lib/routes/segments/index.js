/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { segmentsController } = require('../../controllers');

routes.post('/find-many-by-query', segmentsController.findManyByQuery);
routes.post('/delete-one', segmentsController.deleteOne);
routes.post('/search', segmentsController.searchSegmentsByMatch);
routes.post('/find-lite-many-by-level', segmentsController.findLiteManyByLevel);
routes.post('/retrieve-canonical-form-by-input', segmentsController.retrieveCanonicalFormByInput);
routes.post('/', segmentsController.saveOne);

routes.put('/:id', segmentsController.saveOne);

routes.get('/:id', segmentsController.findOneById);
routes.get('/:id/lite', segmentsController.findLiteOneById);

module.exports = routes;
