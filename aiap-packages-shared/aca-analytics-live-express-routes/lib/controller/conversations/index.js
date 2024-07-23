/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findByQueryDayGroups } = require('./find-by-query-day-groups');
const { findByQueryHourGroups } = require('./find-by-query-hour-groups');
const { findByQueryMonthGroups } = require('./find-by-query-month-groups');
const { findAvgDurationByQueryDayGroups } = require('./find-avg-duration-by-query-day-groups');
const { findAvgDurationByQueryHourGroups } = require('./find-avg-duration-by-query-hour-groups');
const { findWithUserInteractionDayGroups } = require('./find-with-user-interaction-day-groups');
const { findWithUserInteractionHourGroups } = require('./find-with-user-interaction-hour-groups');
const { findChannelUsersByQueryMonthGroups } = require('./find-channel-users-by-query-month-groups');

module.exports = {
  findByQueryDayGroups,
  findByQueryHourGroups,
  findByQueryMonthGroups,
  findAvgDurationByQueryDayGroups,
  findAvgDurationByQueryHourGroups,
  findWithUserInteractionDayGroups,
  findWithUserInteractionHourGroups,
  findChannelUsersByQueryMonthGroups
}
