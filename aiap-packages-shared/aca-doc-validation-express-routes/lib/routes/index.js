/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { auditsRoutes } = require('./audits');
const { docValidationV1Routes } = require('./doc-validation-v1');
const { docValidationV2Routes } = require('./doc-validation-v2');

module.exports = {
  auditsRoutes,
  docValidationV1Routes,
  docValidationV2Routes,
}
