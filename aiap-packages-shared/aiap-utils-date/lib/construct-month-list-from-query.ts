/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-construct-month-list-from-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const dateformat = require('dateformat');

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

export const constructMonthsListFromQuery = (
  query: {
    filter: {
      dateRange: {
        from: string | number | Date,
        to: string | number | Date,
      }
    }
  }
) => {
  let dateRangeFrom;
  let dateRangeTo;
  const RET_VAL = [];
  try {
    dateRangeFrom = query?.filter?.dateRange?.from;
    dateRangeTo = query?.filter?.dateRange?.to;

    const DATE_FROM = new Date(dateRangeFrom);
    const DATE_TO = new Date(dateRangeTo);

    const MONTH_DATE = new Date(dateRangeFrom);

    const MONTHS_COUNT = DATE_TO.getMonth() - DATE_FROM.getMonth() + 12 * (DATE_TO.getFullYear() - DATE_FROM.getFullYear());
    for (let i = 0; i <= MONTHS_COUNT; i++) {
      const YEAR = MONTH_DATE.getFullYear();
      const MONTH = MONTH_DATE.getMonth();
      const LABEL = dateformat(MONTH_DATE, 'mmm, yyyy');
      RET_VAL.push({
        year: YEAR,
        month: MONTH,
        label: LABEL,
      });
      MONTH_DATE.setMonth(MONTH_DATE.getMonth() + 1);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructMonthsListFromQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

