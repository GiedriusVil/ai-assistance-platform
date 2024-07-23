/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { rulesAuditsRoutes } = require('./rules-audits');
const { rulesConditionsRoutes } = require('./rules-conditions');
const { rulesSuppliersRoutes } = require('./rules-suppliers');
const { rulesRoutes } = require('./rules');
//
const { rulesExternalSuppliersRoutes } = require('./rules-external-suppliers')

module.exports = {
    rulesAuditsRoutes,
    rulesConditionsRoutes,
    rulesSuppliersRoutes,
    rulesRoutes,
    //
    rulesExternalSuppliersRoutes,
}
