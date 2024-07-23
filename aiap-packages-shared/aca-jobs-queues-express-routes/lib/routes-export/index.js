/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const routes = express.Router();

const jobsQueuesExportRoutes = require('./queues-export');

routes.use('/queues', jobsQueuesExportRoutes);

module.exports = routes;
