/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisProjectsRoutes = express.Router({ mergeParams: true });

const { aiSearchAndAnalysisProjects } = require('../../controllers');

aiSearchAndAnalysisProjectsRoutes.get('/', aiSearchAndAnalysisProjects.exportManyByQuery);

module.exports = {
  aiSearchAndAnalysisProjectsRoutes,
};
