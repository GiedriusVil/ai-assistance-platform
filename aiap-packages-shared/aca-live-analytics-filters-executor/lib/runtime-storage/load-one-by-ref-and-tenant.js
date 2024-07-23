/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint-disable no-case-declarations */
const MODULE_ID = 'aca-live-analytics-filters-executor-runtime-storage-load-one-by-id-and-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  constructFilterRuntimeIdByRefAndTenant,
  getLiveAnalyticsDatasourceByTenant,
} = require('../utils');

const { compileOne } = require('../compilator');
const { getStorage } = require('./get-storage');

const loadOneByRefAndTenant = async (params) => {
  const SILENT = ramda.pathOr(false, ['options', 'silent'], params);
  const TENANT = params?.tenant;
  try {
    const STORAGE = getStorage();
    const FILTER_REF = params?.ref;
    const FILTER_RUNTIME_ID = constructFilterRuntimeIdByRefAndTenant(params);
    const DATASOURCE = getLiveAnalyticsDatasourceByTenant(TENANT);
    const FILTER_DEF = await DATASOURCE.filters.findOneByRef({}, { ref: FILTER_REF });
    const FILTER_COMPILED = await compileOne(FILTER_DEF);
    STORAGE[FILTER_RUNTIME_ID] = FILTER_COMPILED;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(loadOneByRefAndTenant.name, { ACA_ERROR, params });
    if (!SILENT) {
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  loadOneByRefAndTenant,
}
