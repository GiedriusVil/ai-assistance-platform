/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const lambdaModulesErrorsRoutes = express.Router();

const { lambdaModulesErrorsController } = require('../controller');

lambdaModulesErrorsRoutes.post('/find-many-by-query', lambdaModulesErrorsController.findManyByQuery);

module.exports = {
    lambdaModulesErrorsRoutes,
};
