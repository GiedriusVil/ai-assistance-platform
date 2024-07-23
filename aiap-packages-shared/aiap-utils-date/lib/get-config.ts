/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-get-config';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const getConfig = (
  configs: Array<any>,
  serviceId
) => {
  try {
    for (const CONFIG of configs) {
      if (
        CONFIG.serviceId === serviceId
      ) {
        return CONFIG;
      }
    }
    return null;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getConfig.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
