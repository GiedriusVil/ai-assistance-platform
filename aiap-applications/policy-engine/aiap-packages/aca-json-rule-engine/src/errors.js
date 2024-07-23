/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-json-rule-engine-error';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

class UndefinedFactError extends Error {
  constructor (...params) {
    super(...params);
    this.code = 'UNDEFINED_FACT';
  }
}

module.exports = {
  UndefinedFactError,
};
