/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisProjectsRoutes = express.Router();

const { aiSearchAndAnalysisProjects } = require('../../controllers');

aiSearchAndAnalysisProjectsRoutes.post('/delete-many-by-ids', aiSearchAndAnalysisProjects.deleteManyByIds);
aiSearchAndAnalysisProjectsRoutes.post('/delete-many-by-service-id-and-project-ids', aiSearchAndAnalysisProjects.deleteManyByServiceProjectIds);
aiSearchAndAnalysisProjectsRoutes.post('/find-many-by-query', aiSearchAndAnalysisProjects.findManyByQuery);
aiSearchAndAnalysisProjectsRoutes.post('/save-one', aiSearchAndAnalysisProjects.saveOne);
aiSearchAndAnalysisProjectsRoutes.post('/synchronize-many-by-query', aiSearchAndAnalysisProjects.synchronizeManyByQuery);

module.exports = {
  aiSearchAndAnalysisProjectsRoutes,
};

