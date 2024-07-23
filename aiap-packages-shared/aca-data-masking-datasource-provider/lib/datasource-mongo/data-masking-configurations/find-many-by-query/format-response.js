/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const formatResponse = (records) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(records) &&
    lodash.isArray(records)
  ) {
    for (let record of records) {
      record.key = record._id;
      delete record._id;
      RET_VAL.push(record);
    }
  }
  return RET_VAL;
};

module.exports = {
  formatResponse,
};
