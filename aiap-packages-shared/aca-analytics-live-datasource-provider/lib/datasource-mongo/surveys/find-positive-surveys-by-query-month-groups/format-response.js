/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const formatResponse = (records) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(records) &&
    lodash.isArray(records)
  ) {
    for (let record of records) {
      const POSITIVE_SURVEYS = record?.count;
      if (POSITIVE_SURVEYS) {
        record.count = Math.round(POSITIVE_SURVEYS * 100) / 100;
      }
      RET_VAL.push(record);
    }
  }

  return RET_VAL;
};

module.exports = {
  formatResponse,
};
