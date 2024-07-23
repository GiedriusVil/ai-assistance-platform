/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const rulesChangesRoutes = express.Router();

const { rulesChangesController } = require('../../controller');

rulesChangesRoutes.post('/find-many-by-query', rulesChangesController.findManyByQuery);

module.exports = rulesChangesRoutes;
