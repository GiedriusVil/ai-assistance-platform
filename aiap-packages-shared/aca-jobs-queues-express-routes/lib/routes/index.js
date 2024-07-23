/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { jobsQueuesController } = require('../controllers');

routes.get('/find-one-by-id', jobsQueuesController.findOneById);
routes.get('/find-many-by-query', jobsQueuesController.findManyByQuery);
routes.post('/save-one', jobsQueuesController.saveOne);
routes.post('/delete-many-by-ids', jobsQueuesController.deleteManyByIds);

module.exports = routes;
