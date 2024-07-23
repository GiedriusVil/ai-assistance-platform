/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-dashboards-runtime-data-service-synchronize-with-database-by-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { fsExtra } = require('@ibm-aca/aca-wrapper-fs-extra');

const { getDatasourceByContext } = require('../datasource.utils');

const synchronizeWithDatabaseLiveAnalyticsDashboardsByTenant = async (context, params) => {
  let configLiveAnalyticsDashboardsAbsolutePath;
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
    configLiveAnalyticsDashboardsAbsolutePath = `${params?.configLiveAnalyticsAbsolutePath}/${params?.tenantId}/dashboards`;
    fsExtra.ensureDirSync(configLiveAnalyticsDashboardsAbsolutePath);

    const DASHBOARDS_FILES = fsExtra.readdirSync(configLiveAnalyticsDashboardsAbsolutePath);

    const PROMISES = [];
    if (
      !lodash.isEmpty(DASHBOARDS_FILES) &&
      lodash.isArray(DASHBOARDS_FILES)
    ) {
      for (let dashboardFile of DASHBOARDS_FILES) {
        if (
          !lodash.isEmpty(dashboardFile) &&
          lodash.isString(dashboardFile) &&
          dashboardFile.endsWith('.json')
        ) {
          const DASHBOARD = fsExtra.readJsonSync(`${configLiveAnalyticsDashboardsAbsolutePath}/${dashboardFile}`)
          const DATASOURCE = getDatasourceByContext(context);
          PROMISES.push(
            DATASOURCE.dashboards.saveOne(context, { value: DASHBOARD })
          );
        }
      }
    }
    retVal = await Promise.all(PROMISES);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(synchronizeWithDatabaseLiveAnalyticsDashboardsByTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  synchronizeWithDatabaseLiveAnalyticsDashboardsByTenant,
}
