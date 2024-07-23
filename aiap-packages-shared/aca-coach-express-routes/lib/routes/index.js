/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

// const { allowIfHasPagesPermissions } = require('@ibm-aiap/aiap-user-session-provider');

const routes = express.Router();

const stopWatchMetricsRoutes = require('./stop-watch-metrics');

routes.use(
  '/stop-watch-metrics',
  //  allowIfHasPagesPermissions('EngagementsView'),
  // true,
  stopWatchMetricsRoutes
);

module.exports = routes;
