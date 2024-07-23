/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { classifierModelsRoutes } = require('./classifier-models');
const { classifierModelsChangesRoutes } = require('./classifier-models-changes');

routes.use('/models', classifierModelsRoutes);
routes.use('/models/changes', classifierModelsChangesRoutes);

module.exports = {
  routes
};
