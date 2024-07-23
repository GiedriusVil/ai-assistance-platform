/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const documentsService = require('./documents');
const validationEngagementsService = require('./validation-engagements');
const validationEngagementsChangesService = require('./validation-engagements-changes');
const runtimeDataService = require('./runtime-data');

module.exports = {
  documentsService,
  validationEngagementsService,
  validationEngagementsChangesService,
  runtimeDataService,
}
