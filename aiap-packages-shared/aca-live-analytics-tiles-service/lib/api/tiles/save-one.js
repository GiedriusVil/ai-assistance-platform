/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-tiles-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
  appendAuditInfo,
  calcDiffByValue
} = require('@ibm-aiap/aiap-utils-audit');

const {
  CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const { findOneById } = require('./find-one-by-id');
const ModelsChangesService = require('../models-changes');

const saveOne = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const TILE = params?.value;
    appendAuditInfo(context, TILE);
    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });
    const RET_VAL = await DATASOURCE.tiles.saveOne(context, params);

    const CHANGES_SERVICE_PARAMS = {
      value: RET_VAL,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await runtimeDataService.synchronizeWithConfigDirectoryLiveAnalyticsTilesService(context, { value: RET_VAL });

    await ModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

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
