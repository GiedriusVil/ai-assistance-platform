/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const lambdaModulesRoutes = express.Router();

const { lambdaModulesController } = require('../../controllers');

lambdaModulesRoutes.get('/', lambdaModulesController.retrieveMany);

module.exports = {
    lambdaModulesRoutes,
};
