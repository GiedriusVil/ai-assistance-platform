/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-current-date-as-string';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  currentDate,
} from './current-date';

export const currentDateAsString = () => {
  try {
    const RET_VAL = currentDate().format();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(currentDateAsString.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
