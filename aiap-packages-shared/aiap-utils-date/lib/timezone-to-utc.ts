/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-timezone-to-utc';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const timezoneToUtc = (
  dateFrom: any,
  dateTo: any,
  timezone: any,
) => {
  try {
    const RET_VAL: {
      from?: any,
      to?: any,
    } = {};

    if (
      moment(dateFrom, 'YYYY-MM-DD') <= moment(dateTo, 'YYYY-MM-DD')
    ) {
      RET_VAL.from = moment.tz(dateFrom, 'YYYY-MM-DD', timezone).startOf('day').utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
      RET_VAL.to = moment.tz(dateTo, 'YYYY-MM-DD', timezone).endOf('day').utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
    } else {
      RET_VAL.from = RET_VAL.to = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(timezoneToUtc.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
