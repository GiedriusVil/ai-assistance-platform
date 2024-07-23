/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-dashboards-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError,
} = require('@ibm-aca/aca-utils-errors');

const {
  appendAuditInfo,
  calcDiffByValue
} = require('@ibm-aiap/aiap-utils-audit');

const {
  CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const { findOneById } = require('./find-one-by-id');
const ModelsChangesService = require('../models-changes');


const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const DASHBOARD = params?.value;
    appendAuditInfo(context, DASHBOARD);

    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const RET_VAL = await DATASOURCE.dashboards.saveOne(context, params);

    const CHANGES_SERVICE_PARAMS = {
      value: RET_VAL,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await ModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    await runtimeDataService.synchronizeWithConfigDirectoryLiveAnalyticsDashboardsService(context, { value: RET_VAL });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  saveOne,
}
