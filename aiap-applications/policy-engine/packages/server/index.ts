/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-policy-engine-index';
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

    const configurationProvider = require('@ibm-aiap/aiap-policy-engine-configuration');
    const CONFIG = await configurationProvider.loadConfiguration();

    const LOGGER_OPTIONS = {
      name: MODULE_ID,
    };
    require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);


    await require('@ibm-aiap/aiap-tenants-resources-loader').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-express-midleware-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-redis-client-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-event-stream-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-memory-store-provider').initByConfigurationProvider(configurationProvider);

    //
    await require('@ibm-aiap/aiap-app-datasource-provider').initByConfigurationProvider(configurationProvider);

    //
    await require('@ibm-aca/aca-organizations-datasource-provider').initByConfigurationProvider(configurationProvider);

    //
    await require('@ibm-aca/aca-rules-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-buy-rules-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-classification-rules-datasource-provider').initByConfigurationProvider(configurationProvider);

    //
    await require('@ibm-aiap/aiap-lambda-modules-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-lambda-modules-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-lambda-modules-executor').initByConfigurationProvider(configurationProvider);

    //
    await require('@ibm-aca/aca-rules-engine-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-rules-engine-provider-v2').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-buy-rules-engine-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-catalog-rules-engine-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-classification-rules-engine-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-tenant-event-stream-handler').initByConfigurationProvider(configurationProvider);
    //
    await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);

    //
    await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configurationProvider);

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

