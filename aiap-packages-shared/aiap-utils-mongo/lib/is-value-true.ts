/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-mongo-utils-is-value-true';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


import lodash from '@ibm-aca/aca-wrapper-lodash';

/**
 * Return boolean if it is passed as string
 * @param {*} value 'true' or 'false
 * @returns boolean
 * @deprecated - Will be moved into another library -> @ibm-aiap/aiap-utils-validations
 */
const isValueTrue = (
  value: any,
) => {
  let retVal = false;
  if (
    lodash.isString(value) &&
    value === 'true'
  ) {
    retVal = true;
  } else if (
    lodash.isBoolean(value) &&
    value
  ) {
    retVal = true;
  }
  return retVal;
}

export {
  isValueTrue,
}
