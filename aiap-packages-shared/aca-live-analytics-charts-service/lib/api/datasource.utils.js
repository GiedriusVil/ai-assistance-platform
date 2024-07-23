/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-charts-service-datasource-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { transformContextForLogger } = require('@ibm-aca/aca-data-transformer');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');

const { getAcaLiveAnalyticsDatasourceByContext } = require('@ibm-aca/aca-live-analytics-datasource-provider');

const getAppDatasourceByContext = (context) => {
  try {
    const RET_VAL = getDatasourceV1App();
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve app datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAppDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getDatasourceByContext = (context) => {
  try {
    const RET_VAL = getAcaLiveAnalyticsDatasourceByContext(context);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve liveAnalytics datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getDatasourceByContext.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  getDatasourceByContext,
  getAppDatasourceByContext,
}
