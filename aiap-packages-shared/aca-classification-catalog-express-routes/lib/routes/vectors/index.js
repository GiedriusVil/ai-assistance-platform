/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { vectorsController } = require('../../controllers');

routes.get('/', vectorsController.findManyByQuery);
routes.get('/:id', vectorsController.findOneById);
routes.post('/', vectorsController.saveOne);
routes.post('/save-many', vectorsController.saveMany);

module.exports = routes;
