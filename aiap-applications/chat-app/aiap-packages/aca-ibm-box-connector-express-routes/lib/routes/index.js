/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { boxController } = require('../controllers');

routes.post('/retrieve-access-token', boxController.retrieveAccessToken);
routes.post('/refresh-credentials', boxController.refreshCredentials);

module.exports = routes;
