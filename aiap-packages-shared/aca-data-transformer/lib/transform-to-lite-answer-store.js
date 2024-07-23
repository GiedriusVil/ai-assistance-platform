/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { sanitizeIdAttribute } = require('@ibm-aiap/aiap-utils-mongo');

const transformToLiteAnswerStore = (store) => {
  let retVal = [];
  if (
    !lodash.isEmpty(store)
  ) {
    delete store.answers;
    sanitizeIdAttribute(store);
    retVal = store;
  }
  return retVal;
}

module.exports = {
  transformToLiteAnswerStore,
}
