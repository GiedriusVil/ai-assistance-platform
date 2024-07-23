/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { rulesAuditsRoutes } = require('./rules-audits');
const { rulesRoutes } = require('./rules');
const { rulesConditionsRoutes } = require('./rules-conditions');
const { rulesCatalogsRoutes } = require('./rules-catalogs');
const { rulesExternalCatalogsRoutes } = require('./rules-external-catalogs')

module.exports = {
  rulesAuditsRoutes,
  rulesRoutes,
  rulesConditionsRoutes,
  rulesCatalogsRoutes,
  rulesExternalCatalogsRoutes,
}
