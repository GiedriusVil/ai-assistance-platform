/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
const MODULE_ID = 'aca-buy-rules-service-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (provider) => {
   try {
      if (
         lodash.isEmpty(provider)
      ) {
         const MESSAGE = `Missing required configuration provider parameter! [aca-common-config || aca-lite-config]`
         throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      setConfigurationProvider(provider);
   } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`${initByConfigurationProvider.name}`, { ACA_ERROR });
      throw ACA_ERROR;
   }
}

const {
   rulesService,
   rulesAuditsService,
   rulesActionsService,
   rulesConditionsService,
   rulesSuppliersService,
   //
   rulesExternalSuppliersService,
} = require('./lib');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

module.exports = {
   initByConfigurationProvider,
   rulesService,
   rulesAuditsService,
   rulesActionsService,
   rulesConditionsService,
   rulesSuppliersService,
   //
   rulesExternalSuppliersService,
}
