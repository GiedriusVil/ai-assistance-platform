/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisCollectionsRoutes = express.Router();

const { aiSearchAndAnalysisCollections } = require('../../controllers');

aiSearchAndAnalysisCollectionsRoutes.post('/delete-many-by-ids', aiSearchAndAnalysisCollections.deleteManyByIds);
aiSearchAndAnalysisCollectionsRoutes.post('/delete-many-by-service-project-id-and-collection-ids', aiSearchAndAnalysisCollections.deleteManyByServiceProjectCollectionsIds);
aiSearchAndAnalysisCollectionsRoutes.post('/find-many-by-query', aiSearchAndAnalysisCollections.findManyByQuery);
aiSearchAndAnalysisCollectionsRoutes.post('/find-one-by-id', aiSearchAndAnalysisCollections.findOneById);
aiSearchAndAnalysisCollectionsRoutes.post('/find-supported-languages', aiSearchAndAnalysisCollections.findSupportedLanguages);
aiSearchAndAnalysisCollectionsRoutes.post('/save-one', aiSearchAndAnalysisCollections.saveOne);
aiSearchAndAnalysisCollectionsRoutes.post('/synchronize-many-by-query', aiSearchAndAnalysisCollections.synchronizeManyByQuery);
aiSearchAndAnalysisCollectionsRoutes.post('/query-many-by-service-project-id-and-collections-ids', aiSearchAndAnalysisCollections.queryManyByServiceProjectIdAndCollectionsIds);

module.exports = {
  aiSearchAndAnalysisCollectionsRoutes,
};
