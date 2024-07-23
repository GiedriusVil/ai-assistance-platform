/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const classifierService = require('./classifier-models');
const classifierModelsChangesService = require('./classifier-models-changes');
const runtimeDataService = require('./runtime-data');

module.exports = {
  classifierService,
  classifierModelsChangesService,
  runtimeDataService,
}
