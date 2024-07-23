/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-test-cases-service-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (provider) => {
   try {
      if (
         lodash.isEmpty(provider)
      ) {
         const MESSAGE = `Missing required configuration provider! [aca-lite-config || aca-commong-config]`;
         throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      setConfigurationProvider(provider);
   } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('->', { ACA_ERROR });
      throw ACA_ERROR;
   }
}

const {
   testWorkersService,
   testCasesService,
   testExecutionsService,
} = require('./lib/api');

module.exports = {
   initByConfigurationProvider,
   testWorkersService,
   testCasesService,
   testExecutionsService,
}
