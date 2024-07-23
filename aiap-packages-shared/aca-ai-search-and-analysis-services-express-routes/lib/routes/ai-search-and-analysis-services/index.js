/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisServicesRoutes = express.Router();

const { aiSearchAndAnalysisServices } = require('../../controllers');

aiSearchAndAnalysisServicesRoutes.post('/delete-many-by-ids', aiSearchAndAnalysisServices.deleteManyByIds);
aiSearchAndAnalysisServicesRoutes.post('/find-many-by-query', aiSearchAndAnalysisServices.findManyByQuery);
aiSearchAndAnalysisServicesRoutes.post('/find-one-by-id', aiSearchAndAnalysisServices.findOneById);
aiSearchAndAnalysisServicesRoutes.post('/save-one', aiSearchAndAnalysisServices.saveOne);

module.exports = {
  aiSearchAndAnalysisServicesRoutes,
};
