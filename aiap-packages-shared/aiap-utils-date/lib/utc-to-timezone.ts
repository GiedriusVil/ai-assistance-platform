/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-utc-to-timezone';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const utcToTimezone = (
  data: any,
  timezone: any,
) => {
  try {
    const RET_VAL = data.rows.map(element => {
      const elementDate = moment.utc(element.key[0]).tz(timezone);
      return {
        key: [
          (element.key[0] = elementDate.format('YYYY-MM-DDTHH:mm:ss.SSS')),
          (element.key[1] = elementDate.format('YYYY-MM-DD')),
          (element.key[2] = elementDate.format('HH')),
          element.key[3],
        ],
        value: element.value,
      };
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(utcToTimezone.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
