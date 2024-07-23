/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-service-datasource-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { transformContextForLogger } = require('@ibm-aca/aca-data-transformer');

const { getAcaRulesDatasourceByContext } = require('@ibm-aca/aca-rules-datasource-provider');

const { getDatasourceV1App } = require('@ibm-aiap/aiap-app-datasource-provider');

const getDatasourceByContext = (context) => {
  try {
    const RET_VAL = getAcaRulesDatasourceByContext(context);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve rules datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getDatasourceByContext.name, { error: error });
    throw ACA_ERROR;
  }
}

const getAppDatasource = (context) => {
  try {
    const RET_VAL = getDatasourceV1App();
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve aca-app datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getAppDatasource.name, { error: error });
    throw ACA_ERROR;
  }
}

module.exports = {
  getDatasourceByContext,
  getAppDatasource,
}
