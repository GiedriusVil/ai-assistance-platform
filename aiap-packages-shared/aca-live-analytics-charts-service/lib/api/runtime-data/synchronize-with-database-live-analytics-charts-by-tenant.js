/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-services-runtime-data-service-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseLiveAnalyticsChartsByTenant = async (context, params) => {
  let configLiveAnalyticsChartsAbsolutePath;
  let retVal = [];
  try {
    if (
      lodash.isEmpty(params?.configLiveAnalyticsAbsolutePath)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.configLiveAnalyticsAbsolutePath!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.tenantId)
    ) {
      const ERROR_MESSAGE = `Missing required parameter params?.tenantId!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    configLiveAnalyticsChartsAbsolutePath = `${params?.configLiveAnalyticsAbsolutePath}/${params?.tenantId}/charts`;
    fsExtra.ensureDirSync(configLiveAnalyticsChartsAbsolutePath);

    const CHARTS_FILES = fsExtra.readdirSync(configLiveAnalyticsChartsAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(CHARTS_FILES) &&
      lodash.isArray(CHARTS_FILES)
    ) {
      for (let chartFile of CHARTS_FILES) {
        if (
          !lodash.isEmpty(chartFile) &&
          lodash.isString(chartFile) &&
          chartFile.endsWith('.json')
        ) {
          const CHART = fsExtra.readJsonSync(`${configLiveAnalyticsChartsAbsolutePath}/${chartFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.charts.saveOne(context, { value: CHART })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseLiveAnalyticsChartsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseLiveAnalyticsChartsByTenant,
}
