/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

export const formatResponse = (
  records: Array<any>,
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(records) &&
    lodash.isArray(records)
  ) {
    for (const RECORD of records) {
      RECORD.id = RECORD._id;
      delete RECORD._id;
      RET_VAL.push(RECORD);
    }
  }
  return RET_VAL;
}
