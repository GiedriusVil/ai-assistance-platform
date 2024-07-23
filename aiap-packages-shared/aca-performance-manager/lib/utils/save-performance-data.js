/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-performance-manager-stop-coach-stop-watch';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getTenantsCacheProvider } = require('@ibm-aiap/aiap-tenants-cache-provider');
const { getAcaCoachDatasourceByTenant } = require('@ibm-aca/aca-coach-datasource-provider');

const savePerformanceData = async (context, params) => {
  let contextUserId;

  let gAcaProps;
  let tenantCacheProvider;
  let tenant;
  let datasource;
  let value;
  try {
    contextUserId = context?.user?.id;
    gAcaProps = params?.gAcaProps;
    value = params?.value;
    if (
      lodash.isEmpty(gAcaProps)
    ) {
      const MESSAGE = `Missing required params.gAcaProps object!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    tenantCacheProvider = getTenantsCacheProvider();
    tenant = await tenantCacheProvider.tenants.findOneByGAcaProps({ gAcaProps });
    datasource = getAcaCoachDatasourceByTenant(tenant);
    if (
      lodash.isEmpty(datasource)
    ) {
      const MESSAGE = 'Unable to retrieve coach datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { params: params });
    }
    if (
      lodash.isEmpty(value)
    ) {
      const MESSAGE = `Missing required params.value object!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = await datasource.stopWatchMetrics.saveOne(context, { value });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId });
    logger.error(savePerformanceData.name, { ACA_ERROR });
  }
}

module.exports = {
  savePerformanceData,
}
