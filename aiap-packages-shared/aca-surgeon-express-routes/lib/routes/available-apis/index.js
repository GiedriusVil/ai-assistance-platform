/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const availableApisRoutes = express.Router();

const { availableApisController } = require('../../controllers');

availableApisRoutes.get('/retrieve-many-by-query', availableApisController.retrieveManyByQuery);

module.exports = {
  availableApisRoutes,
};
