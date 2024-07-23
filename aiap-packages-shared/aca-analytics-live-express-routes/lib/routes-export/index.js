/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const dashboardsConfigurationsExportRoutes = require('./dashboards-configurations-export');

routes.use(
  '/dashboards-configurations',
  allowIfHasActionsPermissions('live-metrics-configurations.view.export'),
  dashboardsConfigurationsExportRoutes
);

module.exports = routes;
