/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { rulesRoutes } = require('./rules');
const { rulesAuditsRoutes } = require('./rules-audits');
const { rulesConditionsRoutes } = require('./rules-conditions');
const { rulesClassificationsRoutes } = require('./rules-classifications');
const { rulesClassificationsExternalRoutes } = require('./rules-classifications-external')

module.exports = {
    rulesRoutes,
    rulesAuditsRoutes,
    rulesConditionsRoutes,
    rulesClassificationsRoutes,
    rulesClassificationsExternalRoutes
}
