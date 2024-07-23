/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { countRuleFrequency } = require('./count-rule-frequency');
const { totalValidationRequestsByDay } = require('./total-validation-requests-by-day');

module.exports = {
  countRuleFrequency,
  totalValidationRequestsByDay,
};
