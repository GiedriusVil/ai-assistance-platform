/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-executor-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (configurationProvider) => {
   try {
      if (
         lodash.isEmpty(configurationProvider)
      ) {
         const MESSAGE = 'Missing required configuration provider! [aca-common-config || aca-lite-config]';
         throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      setConfigurationProvider(configurationProvider);
   } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('initByConfigurationProvider', { ACA_ERROR });
      throw ACA_ERROR;
   }
}

const { executeEnrichedByQuery } = require('./lib/executor');
const {
   loadOneByRefAndTenant,
   loadManyByTenant,
   deleteOneByRefAndTenant,
   getOneByRefAndTenant,
   getStorage,
} = require('./lib/runtime-storage');
const { logErrorToDatabase } = require('./lib/utils');
const { compileOne } = require('./lib/compilator');

module.exports = {
   initByConfigurationProvider,
   executeEnrichedByQuery,
   loadOneByRefAndTenant,
   loadManyByTenant,
   deleteOneByRefAndTenant,
   getOneByRefAndTenant,
   getStorage,
   logErrorToDatabase,
   compileOne,
}
