/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const docValidationV1Api = require('./doc-validation-v1');
const docValidationV2Api = require('./doc-validation-v2');

const { createEngineInstance } = require('./create-engine-instance');
const { deleteEngineInstance } = require('./delete-engine-instance');
const { resetAllEngines } = require('./reset-engine-all');
const { resetEngine } = require('./reset-engine-one');

module.exports = {
  docValidationV1Api,
  docValidationV2Api,
  createEngineInstance,
  deleteEngineInstance,
  resetAllEngines,
  resetEngine
}
