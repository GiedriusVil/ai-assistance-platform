/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-health-check';
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

    const configurationProvider = require('@ibm-aiap/aiap-health-check-configuration');
    const CONFIG = await configurationProvider.loadConfiguration();

    const LOGGER_OPTIONS = {
      name: MODULE_ID,
    };
    require('@ibm-aca/aca-common-logger').init(CONFIG, LOGGER_OPTIONS);

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
