/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const rulesService = require('./rules');
const rulesAuditsService = require('./rules-audits');
const rulesCatalogsService = require('./rules-catalogs');
const rulesConditionsService = require('./rules-conditions');
const rulesExternalCatalogsService = require('./rules-external-catalogs');

module.exports = {
  rulesService,
  rulesAuditsService,
  rulesCatalogsService,
  rulesConditionsService,
  rulesExternalCatalogsService,
}
