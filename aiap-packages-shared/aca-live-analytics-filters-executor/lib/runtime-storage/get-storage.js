/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-filters-executor-runtime-storage-get-storage';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const STORAGE = {};

const getStorage = () => {
  return STORAGE;
}

module.exports = {
  getStorage,
}
