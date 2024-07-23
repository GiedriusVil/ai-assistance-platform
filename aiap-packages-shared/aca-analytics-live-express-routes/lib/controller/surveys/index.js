/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const { findPositiveSurveysByQueryMonthGroups } = require('./find-positive-surveys-by-query-month-groups');
const { findPositiveSurveysTargetByQueryMonthGroups } = require('./find-positive-surveys-target-by-query-month-groups');

module.exports = {
  findPositiveSurveysByQueryMonthGroups,
  findPositiveSurveysTargetByQueryMonthGroups,
}
