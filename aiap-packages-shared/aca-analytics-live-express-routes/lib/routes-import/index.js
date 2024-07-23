/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const dashboardsConfigurationsImportRoutes = require('./dashboards-configurations-import');

routes.use(
  '/dashboards-configurations',
  allowIfHasActionsPermissions('live-metrics-configurations.view.import'),
  dashboardsConfigurationsImportRoutes,
);

module.exports = routes;
