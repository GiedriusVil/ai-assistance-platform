/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint-disable no-case-declarations */
const MODULE_ID = 'aca-live-analytics-queries-executor-runtime-storage-load-one-by-id-and-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  constructQueryRuntimeIdByRefAndTenant,
  getLiveAnalyticsDatasourceByTenant,
} = require('../utils');

const { compileOne } = require('../compilator');
const { getStorage } = require('./get-storage');

const loadOneByRefAndTenant = async (params) => {
  const SILENT = ramda.pathOr(false, ['options', 'silent'], params);
  const TENANT = params?.tenant;
  try {
    const STORAGE = getStorage();
    const QUERY_REF = params?.ref;
    const QUERY_RUNTIME_ID = constructQueryRuntimeIdByRefAndTenant(params);
    const DATASOURCE = getLiveAnalyticsDatasourceByTenant(TENANT);
    const QUERY_DEF = await DATASOURCE.queries.findOneByRef({}, { ref: QUERY_REF });
    const QUERY_COMPILED = await compileOne(QUERY_DEF);
    STORAGE[QUERY_RUNTIME_ID] = QUERY_COMPILED;
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
