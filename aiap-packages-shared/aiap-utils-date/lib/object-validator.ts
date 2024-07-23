/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-object-validator';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const objectValidator = (
  obj: any,
  key: any,
) => {
  try {
    const RET_VAL = key.split('.').reduce((o, x) => {
      return typeof o == 'undefined' || o === null ? o : o[x];
    }, obj);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(objectValidator.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
