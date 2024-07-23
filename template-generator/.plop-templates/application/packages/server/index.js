/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-{{dashCase fullName}}';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config

const { formatIntoAcaError,
  addUncaughtExceptionHandler,
  addUnhandledRejectionHandler
} = require('@ibm-aca/aca-utils-errors');

(async () => {
  try {
    addUncaughtExceptionHandler();
    addUnhandledRejectionHandler();

    const configurationProvider = require('@ibm-aiap/aiap-{{dashCase name}}-configuration');
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

    await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);

    const { startServer } = require('./lib/server');
    await startServer();

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.log('TOP_ERROR_HANDLER', { ACA_ERROR });
    if (
      process.env.ACA_ON_UNHANDLED_EXCEPTION_KILL_APPLICATION === 'true'
    ) {
      process.kill(process.pid, 'SIGTERM');
    }
  }
})();
