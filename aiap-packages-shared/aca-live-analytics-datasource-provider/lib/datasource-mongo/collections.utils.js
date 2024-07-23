/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-datasource-mongo-collections-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const DEFAULT_COLLECTIONS = {
  dashboards: 'liveAnalyticsDashboards',
  charts: 'liveAnalyticsCharts',
  queries: 'liveAnalyticsQueries',
  tiles: 'liveAnalyticsTiles',
  filters: 'liveAnalyticsFilters',
  dashboardsChanges: 'liveAnalyticsDashboardsChanges',
  chartsChanges: 'liveAnalyticsChartsChanges',
  queriesChanges: 'liveAnalyticsQueriesChanges',
  tilesChanges: 'liveAnalyticsTilesChanges',
  filtersChanges: 'liveAnalyticsFiltersChanges',
};

const sanitizedCollectionsFromConfiguration = (configuration) => {

  const COLLECTIONS_CONFIGURATION = configuration?.collections;
  const DASHBOARDS = COLLECTIONS_CONFIGURATION?.dashboards;
  const CHARTS = COLLECTIONS_CONFIGURATION?.charts;
  const QUERIES = COLLECTIONS_CONFIGURATION?.queries;
  const TILES = COLLECTIONS_CONFIGURATION?.tiles;
  const FILTERS = COLLECTIONS_CONFIGURATION?.filters;

  const DASHBOARDS_CHANGES = COLLECTIONS_CONFIGURATION?.dashboardsChanges;
  const CHARTS_CHANGES = COLLECTIONS_CONFIGURATION?.chartsChanges;
  const QUERIES_CHANGES = COLLECTIONS_CONFIGURATION?.queriesChanges;
  const TILES_CHANGES = COLLECTIONS_CONFIGURATION?.tilesChanges;
  const FILTERS_CHANGES = COLLECTIONS_CONFIGURATION?.filtersChanges;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  
  if (
    !lodash.isEmpty(DASHBOARDS)
  ) {
    RET_VAL.dashboards = DASHBOARDS;
  }
  if (
    !lodash.isEmpty(CHARTS)
  ) {
    RET_VAL.charts = CHARTS;
  }
  if (
    !lodash.isEmpty(QUERIES)
  ) {
    RET_VAL.queries = QUERIES;
  }
  if (
    !lodash.isEmpty(TILES)
  ) {
    RET_VAL.tiles = TILES;
  }
  if (
    !lodash.isEmpty(FILTERS)
  ) {
    RET_VAL.filters = FILTERS;
  }

  if (
      !lodash.isEmpty(DASHBOARDS_CHANGES)
  ) {
    RET_VAL.dashboardsChanges = DASHBOARDS_CHANGES;
  }
  if (
      !lodash.isEmpty(CHARTS_CHANGES)
  ) {
    RET_VAL.chartsChanges = CHARTS_CHANGES;
  }
  if (
      !lodash.isEmpty(QUERIES_CHANGES)
  ) {
    RET_VAL.queriesChanges = QUERIES_CHANGES;
  }
  if (
      !lodash.isEmpty(TILES_CHANGES)
  ) {
    RET_VAL.tilesChanges = TILES_CHANGES;
  }
  if (
      !lodash.isEmpty(FILTERS_CHANGES)
  ) {
    RET_VAL.filtersChanges = FILTERS_CHANGES;
  }

  return RET_VAL;
}


module.exports = {
  sanitizedCollectionsFromConfiguration,
}
