/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const Joi = require('joi');

const LIVE_ANALYTICS_DATASOURCE_SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  client: Joi.string().required(),
  collections: {
    liveAnalyticsDashboards: Joi.string().required(),
    liveAnalyticsCharts: Joi.string().required(),
    liveAnalyticsQueries: Joi.string().required(),
    liveAnalyticsTiles: Joi.string().required(),
    liveAnalyticsFilters: Joi.string().required(),
    liveAnalyticsFiltersChanges: Joi.string().required(),
    liveAnalyticsTilesChanges: Joi.string().required(),
    liveAnalyticsQueriesChanges: Joi.string().required(),
    liveAnalyticsChartsChanges: Joi.string().required(),
    liveAnalyticsDashboardsChanges: Joi.string().required(),
  }
});

const LIVE_ANALYTICS_DATASOURCE_PROVIDER_SCHEMA = Joi.alternatives().try(
  Joi.object({
    sources: Joi.array().items(LIVE_ANALYTICS_DATASOURCE_SCHEMA)
  }),
  Joi.boolean()
);

module.exports = {
  LIVE_ANALYTICS_DATASOURCE_PROVIDER_SCHEMA
};
