/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-replace-empty-dates-with-zeros';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDate,
} from './get-date';

export const replaceEmptyDatesWithZeros = (
  data: any,
  params: any,
  updateVal: any,
) => {

  let dateFrom;
  let dateTo;

  try {
    if (
      lodash.isEmpty(updateVal)
    ) {
      const MESSAGE = `Missing required updateVal parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    let dataPush: any = { [updateVal]: 0 }

    dateFrom = params?.query?.filter?.dateRange?.from;
    dateTo = params?.query?.filter?.dateRange?.to;
    if (
      dateFrom &&
      dateTo
    ) {
      const DATE_ARRAY = getDate(dateFrom, dateTo);
      const EXISTING_DATES = data.map((m) => m.day);
      for (const DATE_STRING of DATE_ARRAY) {
        if (
          !EXISTING_DATES.includes(DATE_STRING)
        ) {
          dataPush = { ...dataPush, day: DATE_STRING };
          data.push(dataPush);
        }
      }
      data.sort((a, b) => a.day.localeCompare(b.day));
    }
    return data;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(replaceEmptyDatesWithZeros.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
