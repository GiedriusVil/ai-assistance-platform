/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-redis-client-provider-client-io-redis-utils`;

import {
  ACA_ERROR_TYPE,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

const isEmpty = (
  value: any,
  throwError?: any,
) => {
  /* jshint maxcomplexity:  5 */
  const result = value === undefined || value === null;
  if (
    result &&
    throwError
  ) {
    if (
      throwError instanceof Error
    ) {
      throw throwError;
    }
    if (
      typeof throwError === 'string'
    ) {
      throw new Error(throwError);
    }
    const ERROR_MESSAGE = 'Null or undefined value when one was expected';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
  }
  return result;
}


const enforceNotEmpty = (
  args: any,
  error: any,
) => {
  args = args instanceof Array ? args : [args];

  args.forEach(value => {
    isEmpty(value, error || true);
  });
}

export {
  isEmpty,
  enforceNotEmpty,
}
