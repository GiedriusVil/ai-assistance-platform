/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-dashboards-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { setConfigurationProvider } = require('./lib/configuration');

const {
  liveAnalyticsDashboardsService,
  liveAnalyticsDashboardsChangesService,
  runtimeDataService,
} = require('./lib/api');

const initByConfigurationProvider = async (provider) => {
  if (
    lodash.isEmpty(provider)
  ) {
    const ACA_ERROR = {
      type: 'INITIALIZATION_ERROR',
      message: `[${MODULE_ID}] Missing required provider parameter!`
    };
    throw ACA_ERROR;
  }
  setConfigurationProvider(provider);
}

module.exports = {
  initByConfigurationProvider,
  liveAnalyticsDashboardsService,
  liveAnalyticsDashboardsChangesService,
  runtimeDataService,
}
