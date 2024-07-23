/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-mongo-utils-construct-unset-option`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const deepDifference = require('deep-diff');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

const constructUnsetOption = (
  oldValue: any,
  newValue: any,
) => {
  let retVal;
  try {
    const DIFFERENCES = deepDifference(oldValue, newValue);
    if (
      !lodash.isEmpty(DIFFERENCES) &&
      lodash.isArray(DIFFERENCES)
    ) {
      for (let difference of DIFFERENCES) {
        if (
          'D' === difference?.kind
        ) {
          if (
            lodash.isEmpty(retVal)
          ) {
            retVal = {};
          }
          if (
            lodash.isArray(difference?.path) &&
            !lodash.isEmpty(difference?.path) &&
            difference?.path.length === 1
          ) {
            retVal[difference.path.join('.')] = '';
          }
        }
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructUnsetOption.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  constructUnsetOption,
}
