/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-get-hour';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const getHour = (
  start: any,
  end: any,
) => {
  try {
    const RET_VAL = [];
    start = parseInt(start);
    end = parseInt(end);
    while (start <= end) {
      RET_VAL.push(start < 10 ? `0${start.toString()}:00` : `${start.toString()}:00`);
      start += 1;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getHour.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
