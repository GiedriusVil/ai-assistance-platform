/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-executor-utils-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getAcaLiveAnalyticsDatasourceByTenant } = require('@ibm-aca/aca-live-analytics-datasource-provider');

const getLiveAnalyticsDatasourceByTenant = (tenant) => {
  try {
    const RET_VAL = getAcaLiveAnalyticsDatasourceByTenant(tenant);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable retrieve live analytics datasource by tenant!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { tenant });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getLiveAnalyticsDatasourceByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getLiveAnalyticsDatasourceByTenant,
}
