/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-release-assistant-index';
require('@ibm-aca/aca-common-logger').init({}, { name: MODULE_ID }); //Default logger initialization without config

const configurationProvider = require('@ibm-aiap/aiap-release-assistant-configuration');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  isStringTrue
} = require('./lib/utils');

const _addUnhandledRejectionHandler = (logger) => {
  const HANDLER = (reason, promise) => {
    const ACA_ERROR = {
      type: 'UNHANDLED_EXCEPTION',
      readon: reason,
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
    await require('@ibm-aiap/aiap-mongo-client-provider').initByConfigurationProvider(configurationProvider);

    const { release } = require('./lib/release');
    await release(CONFIG.app.releaseVersion, CONFIG);
    // start release here

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
})();
