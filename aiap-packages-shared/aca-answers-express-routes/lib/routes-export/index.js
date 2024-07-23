/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const answersExportRoutes = require('./answers-export');
const answersStoreExporteRoutes = require('./answers-store-export');

routes.use('/:answerStoreId/answers', answersExportRoutes);
routes.use('/', answersStoreExporteRoutes);

module.exports = routes;
