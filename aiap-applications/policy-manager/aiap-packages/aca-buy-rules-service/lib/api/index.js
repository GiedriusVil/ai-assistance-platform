/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const rulesService = require('./rules');
const rulesAuditsService = require('./rules-audits');
const rulesConditionsService = require('./rules-conditions');
const rulesSuppliersService = require('./rules-suppliers');

//
const rulesExternalSuppliersService = require('./rules-external-suppliers');

module.exports = {
    rulesService,
    rulesAuditsService,
    rulesConditionsService,
    rulesSuppliersService,
    //
    rulesExternalSuppliersService,
}
