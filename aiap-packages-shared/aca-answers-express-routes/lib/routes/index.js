/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const answerStoresRoutes = require('./answer-stores');
const answersRoutes = require('./answers');
const answerStoreReleasesRoutes = require('./answer-store-releases');

routes.use('/:answerStoreId/releases', answerStoreReleasesRoutes);
routes.use('/:answerStoreId/answers', answersRoutes);
routes.use('/', answerStoresRoutes);

module.exports = routes;
