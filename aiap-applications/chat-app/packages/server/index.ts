/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
/* eslint no-console: "off" */
const MODULE_ID = 'aca-chat-app';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config

import {
  addUncaughtExceptionHandler,
  addUnhandledRejectionHandler,
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

import {
  isStringTrue
} from './lib/utils';

import {
  startServer
} from './lib/server';

(async () => {
  try {
    addUncaughtExceptionHandler();
    addUnhandledRejectionHandler();

    const configProvider = require('@ibm-aiap/aiap-chat-app-configuration');

    const CONFIG = await configProvider.loadConfiguration();
    const LOGGER_OPTIONS = {
      name: 'aca-chat-app',
    };
    require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);

    await require('@ibm-aiap/aiap-tenant-event-stream-handler').initByConfigurationProvider(configProvider);
    await require('@ibm-aiap/aiap-tenants-resources-loader').initByConfigurationProvider(configProvider);

    await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aiap/aiap-redis-client-provider').initByConfigurationProvider(configProvider);


    await require('@ibm-aiap/aiap-memory-store-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aiap/aiap-event-stream-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aiap/aiap-app-datasource-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aiap/aiap-jwt-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aca/aca-lambda-modules-executor').initByConfigurationProvider(configProvider);


    await require('@ibm-aca/aca-conversations-datasource-provider').initByConfigurationProvider(configProvider);

    await require('@ibm-aca/aca-suggestions-service').initByConfigurationProvider(configProvider);

    await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aca/aca-engagements-cache-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aiap/aiap-lambda-modules-datasource-provider').initByConfigurationProvider(configProvider);


    await require('@ibm-aca/aca-auditor-datasource-provider').initByConfigurationProvider(configProvider);

    await require('@ibm-aiap/aiap-engagements-datasource-provider').initByConfigurationProvider(configProvider);
    await require('@ibm-aca/aca-classifier-datasource-provider').initByConfigurationProvider(configProvider);

    await require('@ibm-aca/aca-socket-io-provider').initByConfigurationProvider(configProvider);

    await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configProvider);

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
