/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { purchaseRequestsRoutes } = require('./purchase-requests');
const { rulesRoutes } = require('./rules');
const { rulesMessagesRoutes } = require('./rules-messages');
const { organizationsRoutes } = require('./organizations');
const { lambdaModulesRoutes } = require('./lambda-modules');
const { lambdaModulesErrorsRoutes } = require('./lambda-modules-errors');

module.exports = {
  purchaseRequestsRoutes,
  rulesRoutes,
  rulesMessagesRoutes,
  organizationsRoutes,
  lambdaModulesRoutes,
  lambdaModulesErrorsRoutes,
}
