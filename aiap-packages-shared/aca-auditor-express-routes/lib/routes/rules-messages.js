/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const rulesMessagesRoutes = express.Router();

const { rulesMessagesController } = require('../controller');

rulesMessagesRoutes.post('/find-many-by-query', rulesMessagesController.findManyByQuery);

module.exports = {
  rulesMessagesRoutes,
};
