/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-split-date';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const splitDate = (
  dateTime: any,
) => {
  try {
    const RET_VAL = moment(dateTime).format('MM/DD/YYYY');
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(splitDate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
