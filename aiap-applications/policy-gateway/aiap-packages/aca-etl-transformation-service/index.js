/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-etl-transformation-service';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (provider) => {
   try {
      if (
         lodash.isEmpty(provider)
      ) {
         const MESSAGE = `Missing required configuration provider parameter! [aca-common-config || aca-lite-config]`;
         throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
      }
      setConfigurationProvider(provider);
   } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('initByConfigurationProvider', { ACA_ERROR });
      throw ACA_ERROR;
   }
}

const {
   transformationService
} = require('./lib/api');

module.exports = {
   initByConfigurationProvider,
   transformationService,
}
