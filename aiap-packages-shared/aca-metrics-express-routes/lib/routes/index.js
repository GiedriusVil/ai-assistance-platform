/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { docValidationMetricsRoutes } = require('./doc-validations');
const { metricsRoutes } = require('./purchase-requests');

module.exports = {
  docValidationMetricsRoutes,
  metricsRoutes,
}
