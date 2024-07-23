/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-executor-runtime-storage-load-many-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  getLiveAnalyticsDatasourceByTenant,
} = require('../utils');

const { loadOneByRefAndTenant } = require('./load-one-by-ref-and-tenant');

const loadManyByTenant = async (params) => {
  const TENANT = params?.tenant;
  const SILENT = ramda.pathOr(false, ['options', 'silent'], params);
  try {
    if (
      lodash.isEmpty(TENANT)
    ) {
      const MESSAGE = 'Missing required params.tenant parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getLiveAnalyticsDatasourceByTenant(TENANT);
    const PARAMS = {
      sort: {
        field: 'id',
        direction: 'asc'
      }
    };
    const RESPONSE = await DATASOURCE.queries.findManyByQuery({}, PARAMS);
    const QUERIES_DEFS = RESPONSE?.items;
    let retVal;
    if (
      lodash.isArray(QUERIES_DEFS)
    ) {
      const PROMISES = [];
      for (let queryDef of QUERIES_DEFS) {
        let tmpParams = {
          tenant: TENANT,
          ref: queryDef?.ref,
          options: { silent: SILENT }
        }
        PROMISES.push(loadOneByRefAndTenant(tmpParams));
      }
      retVal = await Promise.all(PROMISES);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.tenant = TENANT;
    logger.error(loadManyByTenant.name, { ACA_ERROR });
    if (
      !SILENT
    ) {
      throw ACA_ERROR;
    }
  }
}

module.exports = {
  loadManyByTenant,
}
