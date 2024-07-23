/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const routes = express.Router();

const liveAnalyticsDashboardsRoutes = require('./dashboards');
const liveAnalyticsChartsRoutes = require('./charts');
const liveAnalyticsQueriesRoutes = require('./queries');
const liveAnalyticsTilesRoutes = require('./tiles');
const liveAnalyticsFiltersRoutes = require('./filters');
const liveAnalyticsExportsRoutes = require('./exports');
const liveAnalyticsFiltersChangesRoutes = require('./filters-models-changes');
const liveAnalyticsTilesChangesRoutes = require('./tiles-models-changes');
const liveAnalyticsQueriesChangesRoutes = require('./queries-models-changes');
const liveAnalyticsDashboardsChangesRoutes = require('./dashboards-models-changes');
const liveAnalyticsChartsChangesRoutes = require('./charts-models-changes');

routes.use(
  '/dashboards',
  allowIfHasPagesPermissions('DashboardsConfigurationViewV1'),
  liveAnalyticsDashboardsRoutes
);

routes.use(
  '/dashboards/changes',
  allowIfHasPagesPermissions('DashboardsConfigurationViewV1'),
  liveAnalyticsDashboardsChangesRoutes
);

routes.use(
  '/charts',
  allowIfHasPagesPermissions('ChartsConfigurationViewV1'),
  liveAnalyticsChartsRoutes
);

routes.use(
  '/charts/changes',
  allowIfHasPagesPermissions('ChartsConfigurationViewV1'),
  liveAnalyticsChartsChangesRoutes
);

routes.use(
  '/queries',
  allowIfHasPagesPermissions('QueriesConfigurationViewV1'),
  liveAnalyticsQueriesRoutes
);

routes.use(
  '/queries/changes',
  allowIfHasPagesPermissions('QueriesConfigurationViewV1'),
  liveAnalyticsQueriesChangesRoutes
);

routes.use(
  '/filters',
  allowIfHasPagesPermissions('FiltersConfigurationViewV1'),
  liveAnalyticsFiltersRoutes
);

routes.use(
  '/filters/changes',
  allowIfHasPagesPermissions('FiltersConfigurationViewV1'),
  liveAnalyticsFiltersChangesRoutes
);

routes.use(
  '/tiles',
  allowIfHasPagesPermissions('TilesConfigurationViewV1'),
  liveAnalyticsTilesRoutes
);

routes.use(
  '/tiles/changes',
  allowIfHasPagesPermissions('TilesConfigurationViewV1'),
  liveAnalyticsTilesChangesRoutes
);

routes.use(
  '/exports',
  liveAnalyticsExportsRoutes
);

module.exports = routes
