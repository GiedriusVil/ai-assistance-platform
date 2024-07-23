/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { testCasesRoutes } = require('./test-cases');
const { testExecutionsRoutes } = require('./test-executions');
const { testWorkersRoutes } = require('./test-workers');

routes.use('/', testCasesRoutes);
routes.use('/executions', testExecutionsRoutes);
routes.use('/workers', testWorkersRoutes);

module.exports = {
   routes,
};
