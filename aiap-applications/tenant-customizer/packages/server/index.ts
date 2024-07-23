/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-tenant-customizer-index';
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

    const configurationProvider = require('@ibm-aiap/aiap-tenant-customizer-configuration');
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

    await require('@ibm-aiap/aiap-ai-services-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-ai-services-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-audio-voice-services-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-audio-voice-services-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-answers-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-answers-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-conversations-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-conv-shadow-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-conversations-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-analytics-live-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-analytics-live-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-data-masking-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-data-masking-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-classification-catalog-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-jobs-queues-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-classification-catalog-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-jobs-queues-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-auditor-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-auditor-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-lambda-modules-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-lambda-modules-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-lambda-modules-executor').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-engagements-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-engagements-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-tenant-event-stream-handler').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-worker-pool-manager-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-jobs-queue-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-classifier-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-classifier-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-ai-translation-services-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-ai-translation-services-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-ai-search-and-analysis-services-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-ai-search-and-analysis-services-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-object-storage-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-object-storage-service').initByConfigurationProvider(configurationProvider);

    // IF AIAP_*_SERVICE_CONFIGURATION_LOCAL_SYNC_ENABLED
    await require('@ibm-aiap/aiap-engagements-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aiap/aiap-ai-services-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-classifier-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-classification-catalog-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-answers-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aiap/aiap-lambda-modules-service').runtimeDataService.synchronizeWithDatabase({}, {});
    await require('@ibm-aca/aca-audio-voice-services-service').runtimeDataService.synchronizeWithDatabase({}, {});

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
