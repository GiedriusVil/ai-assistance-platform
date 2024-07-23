/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-executor-runtime-storage-get-one-by-ref-and-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const {
  constructQueryRuntimeIdByRefAndTenant,
} = require('../utils');

const { getStorage } = require('./get-storage');

const getOneByRefAndTenant = (params) => {
  try {
    const STORAGE = getStorage();
    const QUERY_RUNTIME_ID = constructQueryRuntimeIdByRefAndTenant(params);
    const RET_VAL = STORAGE[QUERY_RUNTIME_ID];
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getOneByRefAndTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getOneByRefAndTenant,
}
