/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-date-format';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const dateFormat = (
  dateFrom: any,
  dateTo: any,
) => {
  try {
    const RET_VAL: {
      from?: any,
      to?: any,
    } = {};
    if (
      moment(dateFrom, 'MM/DD/YYYY') <= moment(dateTo, 'MM/DD/YYYY')
    ) {
      RET_VAL.from = moment(dateFrom, 'MM/DD/YYYY').format('YYYY-MM-DD');
      RET_VAL.to = moment(dateTo, 'MM/DD/YYYY').format('YYYY-MM-DD');
    } else {
      RET_VAL.from = RET_VAL.to = moment().format('YYYY-MM-DD');
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(dateFormat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
