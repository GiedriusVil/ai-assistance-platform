/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const formatResponse = (records) => {
  const RET_VAL = [];
  if (
    lodash.isArray(records)
  ) {
    for (let record of records) {
      ensureValues(record);
      if (
        !lodash.isEmpty(record?.values) &&
        lodash.isArray(record?.values)
      ) {
        record.values.forEach(value => {
          if (hasLegacyStructure(value)) {
            formatValueIntoNewStructure(value);
          }
        });
      }
      RET_VAL.push(record);
    }
  }
  return RET_VAL;
};

const ensureValues = (record) => {
  if (
    !lodash.isEmpty(record) &&
    lodash.isEmpty(record?.values)
  ) {
    record.values = [];
  }
}

const formatValueIntoNewStructure = (value) => {
  value.type = 'TEXT';
  value.output = {
    text: value.text,
  }
}

const hasLegacyStructure = (value) => {
  let retVal = false;
  if (
    lodash.isEmpty(value?.type) &&
    lodash.isEmpty(value?.output) &&
    !lodash.isEmpty(value?.text)
  ) {
    retVal = true;
  }
  return retVal;
}

module.exports = {
  formatResponse,
};
