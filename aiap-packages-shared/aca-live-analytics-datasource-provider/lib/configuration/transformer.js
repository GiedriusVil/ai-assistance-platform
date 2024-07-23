/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const datasource = (flatClient) => {
  const RET_VAL = {
    name: flatClient?.name,
    type: flatClient?.type,
    client: flatClient?.client,
    collections: {
      liveAnalyticsDashboards: flatClient?.collectionAnalyticsDashboards,
      liveAnalyticsDashboardsModelChanges: flatClient?.collectionAnalyticsDashboardsModelChanges,
      liveAnalyticsCharts: flatClient?.collectionAnalyticsCharts,
      liveAnalyticsChartsModelChanges: flatClient?.collectionAnalyticsChartsModelChanges,
      liveAnalyticsQueries: flatClient?.collectionAnalyticsQueries,
      liveAnalyticsQueriesModelChanges: flatClient?.collectionAnalyticsQueriesModelChanges,
      liveAnalyticsTiles: flatClient?.collectionAnalyticsTiles,
      liveAnalyticsTilesModelChanges: flatClient?.collectionAnalyticsTilesModelChanges,
      liveAnalyticsFilters: flatClient?.collectionAnalyticsFilters,
      liveAnalyticsFiltersModelChanges: flatClient?.collectionAnalyticsFiltersModelChanges,
    }
  }
  return RET_VAL;
}

const datasources = (flatSources) => {
  const RET_VAL = [];
  if (!ramda.isNil(flatSources)) {
    for (let flatSource of flatSources) {
      if (!ramda.isNil(flatSource)) {
        RET_VAL.push(datasource(flatSource));
      }
    }
  }
  return RET_VAL;
}

const transformRawConfiguration = async (rawConfiguration, provider) => {
  const CLIENTS_FLAT = provider.getKeys(
    'LIVE_ANALYTICS_DATASOURCE_PROVIDER',
    [
      'NAME',
      'TYPE',
      'CLIENT',
      'COLLECTION_ANALYTICS_DASHBOARDS',
      'COLLECTION_ANALYTICS_CHARTS',
      'COLLECTION_ANALYTICS_QUERIES',
      'COLLECTION_ANALYTICS_TILES',
      'COLLECTION_ANALYTICS_DASHBOARDS_MODEL_CHANGES',
      'COLLECTION_ANALYTICS_CHARTS_MODEL_CHANGES',
      'COLLECTION_ANALYTICS_QUERIES_MODEL_CHANGES',
      'COLLECTION_ANALYTICS_TILES_MODEL_CHANGES',
    ]
  );
  const DATASOURCES = datasources(CLIENTS_FLAT);
  const RET_VAL = provider.isEnabled('LIVE_ANALYTICS_DATASOURCE_PROVIDER_ENABLED', false, {
    sources: DATASOURCES
  });
  return RET_VAL;
}

module.exports = {
  transformRawConfiguration,
}
