/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisDocumentsRoutes = express.Router();

const { aiSearchAndAnalysisDocuments } = require('../../controllers');

aiSearchAndAnalysisDocumentsRoutes.post('/delete-many-by-service-project-collection-id-and-documents', aiSearchAndAnalysisDocuments.deleteManyByServiceProjectCollectionsAndDocuments);
aiSearchAndAnalysisDocumentsRoutes.post('/list-many-by-query', aiSearchAndAnalysisDocuments.listManyByQuery);

module.exports = {
  aiSearchAndAnalysisDocumentsRoutes,
};
