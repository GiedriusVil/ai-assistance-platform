/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const routes = express.Router();

const queriesImportRoutes = require('./queries-import');
const chartsImportRoutes = require('./charts-import');
const tilesImportRoutes = require('./tiles-import');
const dashboardsImportRoutes = require('./dashboards-import');
const filtersImportRoutes = require('./filters-import');

routes.use(
  '/queries',
  allowIfHasPagesPermissions('QueriesConfigurationViewV1'),
  queriesImportRoutes
);
routes.use(
  '/charts',
  allowIfHasPagesPermissions('ChartsConfigurationViewV1'),
  chartsImportRoutes
);
routes.use(
  '/tiles',
  allowIfHasPagesPermissions('TilesConfigurationViewV1'),
  tilesImportRoutes
);
routes.use(
  '/dashboards',
  allowIfHasPagesPermissions('DashboardsConfigurationViewV1'),
  dashboardsImportRoutes
);
routes.use(
  '/filters',
  allowIfHasPagesPermissions('FiltersConfigurationViewV1'),
  filtersImportRoutes
);

module.exports = routes;
