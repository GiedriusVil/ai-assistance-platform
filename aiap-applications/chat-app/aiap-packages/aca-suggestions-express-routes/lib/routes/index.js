/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { suggestionsController } = require('../controllers');

routes.post('/find-many-by-model-id-and-text', suggestionsController.findManyByModelIdAndText);

module.exports = routes;
