/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const organizationsRoutes = express.Router();

const { organizationsController } = require('../controller');

organizationsRoutes.post('/find-many-by-query', organizationsController.findManyByQuery);

module.exports = {
  organizationsRoutes,
};
