/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisCollectionsRoutes = express.Router({ mergeParams: true });

const { aiSearchAndAnalysisCollections } = require('../../controllers');

aiSearchAndAnalysisCollectionsRoutes.get('/', aiSearchAndAnalysisCollections.exportManyByQuery);

module.exports = {
  aiSearchAndAnalysisCollectionsRoutes,
};
