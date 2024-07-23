/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-transform-to-date';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const moment = require('moment');

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const transformStringToDate = (
  value: any,
) => {
  try {
    let retVal;
    try {
      retVal = moment(value).toDate();
    } catch (error) {
      logger.error('COUGHT_ERROR', {
        error: error,
        text: `${error}`
      });
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transformStringToDate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
