/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config

import {
  formatIntoAcaError,
  addUncaughtExceptionHandler,
  addUnhandledRejectionHandler
} from '@ibm-aca/aca-utils-errors';

import {
  isStringTrue
} from './lib/utils';

(async () => {
  try {
    addUncaughtExceptionHandler();
    addUnhandledRejectionHandler();

    const configurationProvider = require('@ibm-aiap/aiap-live-analytics-configuration');
    const CONFIG = await configurationProvider.loadConfiguration();
    const LOGGER_OPTIONS = {
      name: MODULE_ID,
    };

    require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);

    require('@ibm-aiap/aiap-jwt-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-tenants-resources-loader').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-redis-client-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-memory-store-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-event-stream-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-app-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-app-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-audit-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-conversations-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-conv-shadow-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-conversations-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-analytics-live-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-analytics-live-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-auditor-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-auditor-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-live-analytics-datasource-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-live-analytics-charts-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-live-analytics-dashboards-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-live-analytics-filters-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-live-analytics-queries-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-live-analytics-tiles-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-tenant-event-stream-handler').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);

    // IF AIAP_*_SERVICE_CONFIGURATION_LOCAL_SYNC_ENABLED
    await require('@ibm-aca/aca-live-analytics-charts-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-live-analytics-dashboards-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-live-analytics-filters-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-live-analytics-queries-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-live-analytics-tiles-service').runtimeDataService.synchronizeWithDatabase({}, {});

    const { startServer } = require('./lib/server');
    await startServer();

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.log('TOP_ERROR_HANDLER', { ACA_ERROR });
    if (
      isStringTrue(process.env.ACA_ON_UNHANDLED_EXCEPTION_KILL_APPLICATION)
    ) {
      process.kill(process.pid, 'SIGTERM');
    }
  }
})();
