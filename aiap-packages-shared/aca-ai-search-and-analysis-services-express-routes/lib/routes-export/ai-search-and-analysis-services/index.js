/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const aiSearchAndAnalysisServicesRoutes = express.Router({ mergeParams: true });

const { aiSearchAndAnalysisServices } = require('../../controllers');

aiSearchAndAnalysisServicesRoutes.get('/', aiSearchAndAnalysisServices.exportManyByQuery);

module.exports = {
  aiSearchAndAnalysisServicesRoutes,
};
