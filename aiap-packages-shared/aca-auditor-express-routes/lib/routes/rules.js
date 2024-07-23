/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const rulesRoutes = express.Router();

const { rulesController } = require('../controller');

rulesRoutes.post('/find-many-by-query', rulesController.findManyByQuery);

module.exports = {
    rulesRoutes,
};
