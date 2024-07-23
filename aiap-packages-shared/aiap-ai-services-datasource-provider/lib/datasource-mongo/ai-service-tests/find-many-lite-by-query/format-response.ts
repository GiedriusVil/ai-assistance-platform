/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

import lodash from '@ibm-aca/aca-wrapper-lodash';

export const formatResponse = (
  records: Array<any>,
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(records) &&
    lodash.isArray(records)
  ) {
    RET_VAL.push(...records);
  }
  return RET_VAL;
}
