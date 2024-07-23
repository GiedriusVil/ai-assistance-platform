/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-replace-empty-hours-with-zeros';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getHour,
} from './get-hour';

export const replaceEmptyHoursWithZeros = (
  data: any,
  updateVal: any,
) => {
  try {
    if (
      lodash.isEmpty(updateVal)
    ) {
      const ERROR_MESSAGE = `Missing required updateVal parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const RESULT = [];
    data.map((obj) => {
      RESULT.push({
        day: `${obj.day.trim()}:00`,
        [updateVal]: obj[updateVal],
      });
    });
    let dataPush: any = { [updateVal]: 0 }
    const HOUR_ARRAY = getHour(0, 23);
    const EXISTING_HOURS = RESULT.map((m) => m.day);
    for (const HOUR_STRING of HOUR_ARRAY) {
      if (
        !EXISTING_HOURS.includes(HOUR_STRING)
      ) {
        dataPush = { ...dataPush, day: HOUR_STRING };
        RESULT.push(dataPush);
      }
    }
    RESULT.sort((a, b) => a.day.localeCompare(b.day));
    return RESULT;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${replaceEmptyHoursWithZeros.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
