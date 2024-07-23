/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-conv-quality-manager-server-index';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config

import {
  formatIntoAcaError,
  addUncaughtExceptionHandler,
  addUnhandledRejectionHandler
} from '@ibm-aca/aca-utils-errors';

import {
  isStringTrue
} from './lib/utils';

try {
  (async () => {
    const configurationProvider = require('@ibm-aiap/aiap-conv-quality-manager-configuration');
    const CONFIG = await configurationProvider.loadConfiguration();

    const LOGGER_OPTIONS = {
      name: 'aca-conversations-quality-manager',
    };
    require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);
    const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

    try {
      addUncaughtExceptionHandler();
      addUnhandledRejectionHandler();


      await require('@ibm-aiap/aiap-tenants-resources-loader').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configurationProvider);
      await require('@ibm-aiap/aiap-redis-client-provider').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aiap/aiap-jwt-provider').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aiap/aiap-memory-store-provider').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aiap/aiap-event-stream-provider').initByConfigurationProvider(configurationProvider);
      await require('@ibm-aca/aca-lambda-modules-executor').initByConfigurationProvider(configurationProvider);
      await require('@ibm-aiap/aiap-lambda-modules-datasource-provider').initByConfigurationProvider(configurationProvider);
      await require('@ibm-aiap/aiap-app-datasource-provider').initByConfigurationProvider(configurationProvider);
      await require('@ibm-aiap/aiap-app-service').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aca/aca-test-cases-datasource-provider').initByConfigurationProvider(configurationProvider);
      await require('@ibm-aca/aca-test-cases-service').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aca/aca-test-worker-provider').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);

      await require('@ibm-aca/aca-coach-datasource-provider').initByConfigurationProvider(configurationProvider);
      await require('@ibm-aca/aca-coach-service').initByConfigurationProvider(configurationProvider);

      const { startServer } = require('./lib/server');
      await startServer();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
    }
  })();
} catch (error) {
  const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
  console.log('TOP_ERROR_HANDLER', { ACA_ERROR });
  if (
    isStringTrue(process.env.ACA_ON_UNHANDLED_EXCEPTION_KILL_APPLICATION)
  ) {
    process.kill(process.pid, 'SIGTERM');
  }
}
