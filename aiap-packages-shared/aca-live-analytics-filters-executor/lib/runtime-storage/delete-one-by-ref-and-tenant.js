/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-filters-executor-runtime-storage-delete-one-by-id-and-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructFilterRuntimeIdByRefAndTenant } = require('../utils');

const { getStorage } = require('./get-storage');

const deleteOneByRefAndTenant = async (params) => {
  try {
    const STORAGE = getStorage();

    const FILTER_RUNTIME_ID = constructFilterRuntimeIdByRefAndTenant(params);
    const FILTER = STORAGE[FILTER_RUNTIME_ID];
    if (
      lodash.isEmpty(FILTER)
    ) {
      return;
    }
    delete STORAGE[FILTER_RUNTIME_ID];
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteOneByRefAndTenant.name, { ACA_ERROR, params });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteOneByRefAndTenant,
}
