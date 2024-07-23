/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-portal-index';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config

import configurationProvider from '@ibm-aiap/aiap-portal-configuration';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';
import { isStringTrue } from './lib/utils';

const _addUnhandledRejectionHandler = (logger) => {
  const HANDLER = (reason: Error | any, promise: any) => {
    const ACA_ERROR = {
      type: 'UNHANDLED_EXCEPTION',
      reason: reason,
      promise: promise
    };
    logger.error('UNHANDLED_EXCEPTION_HANDLER', { ACA_ERROR });
    if (
      isStringTrue(process.env.ACA_ON_UNHANDLED_EXCEPTION_KILL_APPLICATION)
    ) {
      process.kill(process.pid, 'SIGTERM');
    }
  };
  process.on('unhandledRejection', HANDLER);
}

(async () => {
  try {
    const CONFIG = await configurationProvider.loadConfiguration();

    const LOGGER_OPTIONS = {
      name: MODULE_ID,
    };
    require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);
    const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

    _addUnhandledRejectionHandler(logger);

    require('@ibm-aiap/aiap-jwt-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-tenants-resources-loader').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-express-midleware-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-redis-client-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-memory-store-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-tenants-memory-store').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-event-stream-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-app-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-app-service').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aiap/aiap-app-service').runtimeDataService.synchronizeWithDatabase({}, {});

    await require('@ibm-aiap/aiap-tenants-cache-provider').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-audit-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aca/aca-auditor-datasource-provider').initByConfigurationProvider(configurationProvider);
    await require('@ibm-aca/aca-auditor-service').initByConfigurationProvider(configurationProvider);

    await require('@ibm-aiap/aiap-main-event-stream-handler').initByConfigurationProvider(configurationProvider);

    const { startServer } = require('./lib/server');
    await startServer();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
})();
