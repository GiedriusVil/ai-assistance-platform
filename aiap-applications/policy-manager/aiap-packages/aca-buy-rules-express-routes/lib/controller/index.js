/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const rulesController = require('./rules');
const rulesAuditsController = require('./rules-audits');
const rulesConditionsController = require('./rules-conditions');
const rulesSuppliersController = require('./rules-suppliers');
//
const rulesExternalSuppliersController = require('./rules-external-suppliers');

module.exports = {
    rulesController,
    rulesAuditsController,
    rulesConditionsController,
    rulesSuppliersController,
    //
    rulesExternalSuppliersController,
}
