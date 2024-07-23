/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-performace-manager-coach-stop-watch';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { v4: uuidv4 } = require('uuid');

const { savePerformanceData } = require('../utils');

class CoachStopWatch {

  duractionMSecPreviousLap = 0;

  user = {
    id: 'SYSTEM'
  }
  value = {
    laps: [],
    previousLapDuration: 0,
  }

  constructor(params) {
    this.value.id = params?.coachStopWatch?.id || uuidv4();
    this.value.gAcaProps = params?.coachStopWatch?.gAcaProps;
    this.value.type = params?.coachStopWatch?.type;
  }

  start() {
    try {
      this.value.created = {
        user: this.user,
        date: new Date(),
      }
      this.value.startHrTime = process.hrtime();
      return this;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('start', { ACA_ERROR });
    }
  }

  durationMSec() {
    try {
      const NS_PER_SEC = 1e9;
      const NS_TO_MS = 1e6;
      const DIFF = process.hrtime(this.value.startHrTime);
      const RET_VAL = (DIFF[0] * NS_PER_SEC + DIFF[1]) / NS_TO_MS;
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('durationMSec', { ACA_ERROR });
    }
  }

  lap(name) {
    let timestamp;
    let number;
    let durationMSecStopWatch;
    let durationMSec;
    try {
      timestamp = new Date();

      durationMSecStopWatch = this.durationMSec();
      durationMSec = durationMSecStopWatch - this.duractionMSecPreviousLap;

      this.duractionMSecPreviousLap = this.duractionMSecPreviousLap + durationMSec;

      number = this.value?.laps?.length;
      const LAP = { timestamp, name, number, durationMSec, durationMSecStopWatch };
      this.value.laps.push(LAP);
      return this;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('lap', { ACA_ERROR });
    }
  }

  async stop(params) {
    let date;
    try {
      date = new Date();

      this.value.stopHrTime = process.hrtime();
      this.value.destroyed = {
        user: this.user,
        date: date,
      };
      this.value.durationMSec = this.durationMSec();
      const CONTEXT = {
        user: this.user,
      }
      const PARAMS = {
        gAcaProps: this.value.gAcaProps,
        value: ramda.mergeDeepRight(this.value, params),
      }
      savePerformanceData(CONTEXT, PARAMS);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('stop', { ACA_ERROR });
    }
  }

  async stopAndDestroy(params) {
    try {
      await this.stop(params);
      await this.destroy();
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('stopAndDestroy', { ACA_ERROR });
    }
  }

  async destroy() {
    try {
      delete this;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('destroy', { ACA_ERROR });
    }
  }

  static getInstance(params) {
    const RET_VAL = new CoachStopWatch(params);
    return RET_VAL;
  }
}

const WATCHES = {};

const getInstance = (params) => {
  let retVal = WATCHES[params?.id];
  if (lodash.isEmpty(retVal)) {
    retVal = new CoachStopWatch(params);
    WATCHES[retVal?.id] = retVal;
  }
  return retVal;
}

module.exports = {
  getInstance,
  CoachStopWatch,
}
