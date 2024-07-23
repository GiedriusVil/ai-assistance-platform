/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-index';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config

import {
  isStringTrue
} from './lib/utils';

import {
  addUncaughtExceptionHandler,
  addUnhandledRejectionHandler,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { startServer } from './lib/server';

try {
  (async () => {
    const configurationProvider = require('@ibm-aiap/aiap-soe-configuration');
    addUncaughtExceptionHandler();
    addUnhandledRejectionHandler();

    const CONFIG = await configurationProvider.loadConfiguration();
    const LOGGER_OPTIONS = {
      name: MODULE_ID,
    };
    require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);

    const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

    await require('@ibm-aiap/aiap-soe-brain').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-soe-bot-socketio').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-tenant-event-stream-handler').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-tenants-resources-loader').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-redis-client-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-app-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-answers-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-conversations-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-conv-shadow-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-analytics-live-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-auditor-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-lambda-modules-datasource-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-lambda-modules-executor').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-jwt-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-classification-catalog-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-engagements-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-ai-services-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-memory-store-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-event-stream-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-middleware-fulfill').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-engagements-cache-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-middleware-context-var-toggle').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-middleware-message-outgoing-emitter').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-middleware-reconnection-check').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-middleware-session').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-middleware-message-length-check').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-middleware-classifier').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-middleware-ai-service-change-loop-handler').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-middleware-client-profile-context').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-middleware-wait').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-middleware-delay').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-data-masking-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-data-masking-provider/initialize').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-conv-shadow-datasource-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-watson-translator-client-provider').initByConfigurationProvider(configurationProvider);
    // ANBE TEMP REMOVAL
    // await require('@ibm-aca/aca-watson-discovery-v2-client-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-adapter-microsoft').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-middleware-context-restore').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-ai-translation-services-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-ai-translation-services-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-ai-search-and-analysis-services-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-ai-search-and-analysis-services-service').initByConfigurationProvider(configurationProvider);

    logger.info('[SERVER] STARTING ACA BOT SERVER');

    if (
      logger.isDebug()
    ) {
      logger.debug('[SERVER] Loading config', { id: 3, CONFIG });
    }

    const { server } = await startServer(CONFIG, configurationProvider);

    process.once('SIGUSR2', () => {
      server.close(() => {
        process.kill(process.pid, 'SIGUSR2');
      });
    });

    process.on('rejectionHandled', (p) => logger.warn('Rejection handled', { p }));
  })();
} catch (error) {
  const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
  console.log('TOP_ERROR_HANDLER', { ACA_ERROR });
  if (isStringTrue(process.env.ACA_ON_UNHANDLED_EXCEPTION_KILL_APPLICATION)) {
    process.kill(process.pid, 'SIGTERM');
  }
}
