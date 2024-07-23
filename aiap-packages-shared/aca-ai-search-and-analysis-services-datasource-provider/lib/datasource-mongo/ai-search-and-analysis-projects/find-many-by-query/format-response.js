/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');
const { decryptAiSearchAndAnalysisServicePassword } = require('../../utils');

const formatResponse = (config, records) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(records) &&
    lodash.isArray(records)
  ) {
    for (let record of records) {
      decryptAiSearchAndAnalysisServicePassword(config.encryptionKey, record);
      sanitizeIdAttribute(record);
      RET_VAL.push(record);
    }
  }
  return RET_VAL;
};

module.exports = {
  formatResponse,
};
