/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-live-analytics-is-date-range-day';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const isDateRangeDay = (
  dateRange: {
    mode: any,
    from: any,
    to: any,
  },
) => {
  try {
    let retVal = false;
    if (
      dateRange?.mode === 'day'
    ) {
      retVal = true;
    }
    if (
      dateRange?.mode === 'custom'
    ) {
      if (
        dateRange?.from &&
        dateRange?.to
      ) {
        const DURATION_IN_TIME = new Date(dateRange?.to).getTime() - new Date(dateRange?.from).getTime();
        const DURATION_IN_DAY = DURATION_IN_TIME / (1000 * 3600 * 24);
        if (DURATION_IN_DAY <= 1) {
          retVal = true;
        }
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(isDateRangeDay.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
