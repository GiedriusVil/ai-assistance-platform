/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const purchaseRequestsRoutes = express.Router();

const { purchaseRequestsController } = require('../controller');

purchaseRequestsRoutes.post('/find-many-by-query', purchaseRequestsController.findManyByQuery);

module.exports = {
    purchaseRequestsRoutes,
};
