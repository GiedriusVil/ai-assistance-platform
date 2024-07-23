/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const rulesController = require('./rules');
const rulesAuditsController = require('./rules-audits');
const rulesCatalogsController = require('./rules-catalogs');
const rulesConditionsController = require('./rules-conditions');
const rulesExternalCatalogsController = require('./rules-external-catalogs');

module.exports = {
    rulesController,
    rulesAuditsController,
    rulesCatalogsController,
    rulesConditionsController,
    rulesExternalCatalogsController,
}
