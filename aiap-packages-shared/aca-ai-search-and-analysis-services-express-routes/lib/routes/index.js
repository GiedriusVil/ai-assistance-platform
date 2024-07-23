/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const routes = express.Router();

const { aiSearchAndAnalysisServicesRoutes } = require('./ai-search-and-analysis-services');
const { aiSearchAndAnalysisProjectsRoutes } = require('./ai-search-and-analysis-projects');
const { aiSearchAndAnalysisCollectionsRoutes } = require('./ai-search-and-analysis-collections');
const { aiSearchAndAnalysisDocumentsRoutes } = require('./ai-search-and-analysis-documents');

routes.use('/services', aiSearchAndAnalysisServicesRoutes);
routes.use('/projects', aiSearchAndAnalysisProjectsRoutes);
routes.use('/collections', aiSearchAndAnalysisCollectionsRoutes);
routes.use('/documents', aiSearchAndAnalysisDocumentsRoutes);

module.exports = {
  routes,
};
