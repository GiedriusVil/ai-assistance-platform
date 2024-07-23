/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-lambda-modules-executor-runtime-storage-delete-one-by-id-and-tenant`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { constructModuleRuntimeIdByIdAndTenant } = require('../utils');

const { getStorage } = require('./get-storage');

const deleteOneByIdAndTenant = async (params) => {
  try {
    const STORAGE = getStorage();

    const LAMBDA_MODULE_RUNTIME_ID = constructModuleRuntimeIdByIdAndTenant(params);
    const LAMBDA_MODULE = STORAGE[LAMBDA_MODULE_RUNTIME_ID];
    if (
      lodash.isEmpty(LAMBDA_MODULE)
    ) {
      return;
    }
    delete STORAGE[LAMBDA_MODULE_RUNTIME_ID];
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${deleteOneByIdAndTenant.name}`, { ACA_ERROR, params });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteOneByIdAndTenant,
}
