/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-current-date';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const currentDate = () => {
  try {
    const RET_VAL = moment();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(currentDate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
