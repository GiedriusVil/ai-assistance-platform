/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const routes = express.Router();

const classifierImportRoutes = require('./models');

routes.use( '/models', classifierImportRoutes );

module.exports = routes;
