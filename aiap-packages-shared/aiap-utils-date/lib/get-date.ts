/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-get-date';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const getDate = (
  start: any,
  end: any,
) => {
  try {
    const RET_VAL = [];
    start = moment(start, 'YYYY-MM-DD').format('YYYY-MM-DD');
    end = moment(end, 'YYYY-MM-DD').format('YYYY-MM-DD');

    while (start <= end) {
      RET_VAL.push(start);
      start = moment(start).add(1, 'd').format('YYYY-MM-DD');
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getDate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
