/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const rulesService = require('./rules');
const rulesAuditsService = require('./rules-audits');
const rulesConditionsService = require('./rules-conditions');
const rulesClassificationsService = require('./rules-classifications');
const rulesClassificationsExternalService = require('./rules-external-classifications');

module.exports = {
  rulesService,
  rulesAuditsService,
  rulesConditionsService,
  rulesClassificationsService,
  rulesClassificationsExternalService,
}
