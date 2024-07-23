/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const answersImportRoutes = require('./answers-import');
const answersStoreImportRoutes = require('./answers-store-import');

routes.use('/:answerStoreId/answers', answersImportRoutes);
routes.use('/', answersStoreImportRoutes);

module.exports = routes;
