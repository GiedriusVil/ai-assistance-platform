/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-auditor-service-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('ramda');
const lodash = require('lodash');

const { setConfigurationProvider } = require('./lib/configuration');

const initByConfigurationProvider = async (provider) => {
   if (
      lodash.isEmpty(provider)
   ) {
      const ACA_ERROR = {
         type: 'INITIALIZATION_ERROR',
         message: `[${MODULE_ID}] Missing required provider parameter!`
      };
      throw ACA_ERROR;
   }
   setConfigurationProvider(provider);
}

const purchaseRequestsAuditorService = require('./lib/api/purchase-requests');
const rulesAuditorService = require('./lib/api/rules');
const messagesAuditorService = require('./lib/api/rules-messages');
const organizationsAuditorService = require('./lib/api/organizations');
const lambdaModulesAuditorService = require('./lib/api/labmda-modules');
const lambdaModulesErrorsAuditorService = require('./lib/api/labmda-modules-errors');

module.exports = {
   initByConfigurationProvider,
   purchaseRequestsAuditorService,
   rulesAuditorService,
   messagesAuditorService,
   organizationsAuditorService,
   lambdaModulesAuditorService,
   lambdaModulesErrorsAuditorService,
}
