/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-mongo-utils-project-date-to-string';

import lodash from '@ibm-aca/aca-wrapper-lodash';

const projectField$DateToString = (
  timezone: any,
  format: any,
  field: any,
) => {
  if (
    lodash.isEmpty(timezone)
  ) {
    throw new Error(`[${MODULE_ID}] Missing mandatory param timezone. [Actual: ${timezone}]`);
  }
  if (
    lodash.isEmpty(format)
  ) {
    throw new Error(`[${MODULE_ID}] Missing mandatory param format. [Actual: ${format}]`);
  }
  if (
    lodash.isEmpty(field)
  ) {
    throw new Error(`[${MODULE_ID}] Missing mandatory param field. [Actual: ${field}]`);
  }
  const RET_VAL = {
    $dateToString: {
      format: format,
      date: field,
      timezone: timezone
    }
  };
  return RET_VAL;
};

export {
  projectField$DateToString,
}
