/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const validationEngagementsChangesRoutes = express.Router();

const { validationEngagementsChangesController } = require('../../controller');

validationEngagementsChangesRoutes.post('/find-many-by-query', validationEngagementsChangesController.findManyByQuery);

module.exports = validationEngagementsChangesRoutes;
