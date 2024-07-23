/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const rulesController = require('./rules');
const rulesAuditsController = require('./rules-audits');
const rulesClassificationsController = require('./rules-classifications');
const rulesClassificationsExternalController = require('./rules-classifications-external');
const rulesConditionsController = require('./rules-conditions');

module.exports = {
    rulesController,
    rulesAuditsController,
    rulesConditionsController,
    rulesClassificationsExternalController,
    rulesClassificationsController,
}
