/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { totalValidationRequestsByDay } = require('./total-validation-requests-by-day');
const { countRuleFrequency } = require('./count-rule-frequency');

module.exports = {
  countRuleFrequency,
  totalValidationRequestsByDay,
}
