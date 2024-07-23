/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisProjectsRoutes = express.Router({ mergeParams: true });

const multer = require('multer');

const importer = multer({
  storage: multer.diskStorage({})
})

const { aiSearchAndAnalysisProjects } = require('../../controllers');

aiSearchAndAnalysisProjectsRoutes.post('/', importer.single('aiSearchAndAnalysisProjectsFile'), aiSearchAndAnalysisProjects.importManyFromFile);

module.exports = {
  aiSearchAndAnalysisProjectsRoutes,
};
