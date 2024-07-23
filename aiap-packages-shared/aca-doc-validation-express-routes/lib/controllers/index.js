/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const auditsController = require('./audits');
const docValidationV1Controller = require('./doc-valication-v1');
const docValidationV2Controller = require('./doc-valication-v2');

module.exports = {
  auditsController,
  docValidationV1Controller,
  docValidationV2Controller,
}
