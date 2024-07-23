/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const routesExport = express.Router({ mergeParams: true });

const { aiSearchAndAnalysisServicesRoutes } = require('./ai-search-and-analysis-services');
const { aiSearchAndAnalysisProjectsRoutes } = require('./ai-search-and-analysis-projects');
const { aiSearchAndAnalysisCollectionsRoutes } = require('./ai-search-and-analysis-collections');

routesExport.use('/services', aiSearchAndAnalysisServicesRoutes);
routesExport.use('/projects', aiSearchAndAnalysisProjectsRoutes);
routesExport.use('/collections', aiSearchAndAnalysisCollectionsRoutes);

module.exports = {
  routesExport,
};
