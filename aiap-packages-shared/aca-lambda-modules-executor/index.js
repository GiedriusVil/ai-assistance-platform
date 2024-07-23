/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-lamdbda-modules-executor-index`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
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

const { executeEnrichedByLambdaModule } = require('./lib/executor');
const {
   loadOneByIdAndTenant,
   loadManyByTenant,
   deleteOneByIdAndTenant,
   getOneByIdAndTenant,
   getStorage,
   loadLambdaModuleAsMsTeamsCard,
} = require('./lib/runtime-storage');
const { logErrorToDatabase } = require('./lib/utils');
const { compileOne } = require('./lib/compilator');

module.exports = {
   initByConfigurationProvider,
   executeEnrichedByLambdaModule,
   loadOneByIdAndTenant,
   loadManyByTenant,
   deleteOneByIdAndTenant,
   getOneByIdAndTenant,
   getStorage,
   logErrorToDatabase,
   compileOne,
   loadLambdaModuleAsMsTeamsCard,
}
