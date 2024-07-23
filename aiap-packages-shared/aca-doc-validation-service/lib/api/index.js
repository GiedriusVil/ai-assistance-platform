/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const docValidationAuditsService = require('./audits');
const docValidationV1Service = require('./doc-validation-v1');
const docValidationV2Service = require('./doc-validation-v2');

module.exports = {
  docValidationAuditsService,
  docValidationV1Service,
  docValidationV2Service,
}
