/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const {
  getInstance,
  CoachStopWatch,
} = require('./coach-stop-watch');

const { COACH_STOP_WATCH_TYPES } = require('./coach-stop-watch-types');

module.exports = {
  getInstance,
  CoachStopWatch,
  COACH_STOP_WATCH_TYPES,
};
