/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { positiveAndNegativeFeedbacks } = require('./positive-and-negative-feedbacks');
const { findPositiveFeedbacksByQueryMonthGroups } = require('./find-positive-feedbacks-by-query-month-groups');
const { findPositiveFeedbacksTargetByQueryMonthGroups } = require('./find-positive-feedbacks-target-by-query-month-groups');

module.exports = {
  positiveAndNegativeFeedbacks,
  findPositiveFeedbacksByQueryMonthGroups,
  findPositiveFeedbacksTargetByQueryMonthGroups,
}
