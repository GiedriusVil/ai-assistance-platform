/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const queriesExportRoutes = require('./queries-export');
const chartsExportRoutes = require('./charts-export');
const tilesExportRoutes = require('./tiles-export')
const dashboardsExportRoutes = require('./dashboards-export')
const filtersExportRoutes = require('./filters-export');

routes.use(
  '/queries',
  allowIfHasPagesPermissions('QueriesConfigurationViewV1'),
  queriesExportRoutes,
);
routes.use(
  '/charts',
  allowIfHasPagesPermissions('ChartsConfigurationViewV1'),
  chartsExportRoutes,
);
routes.use(
  '/tiles',
  allowIfHasPagesPermissions('TilesConfigurationViewV1'),
  tilesExportRoutes,
);
routes.use(
  '/dashboards',
  allowIfHasPagesPermissions('DashboardsConfigurationViewV1'),
  dashboardsExportRoutes,
);
routes.use(
  '/filters',
  allowIfHasPagesPermissions('FiltersConfigurationViewV1'),
  filtersExportRoutes,
);

module.exports = routes;
