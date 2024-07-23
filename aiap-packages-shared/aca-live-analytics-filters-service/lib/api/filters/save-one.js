/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-filters-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

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

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const { findOneById } = require('./find-one-by-id');
const ModelsChangesService = require('../models-changes');

const saveOne = async (context, params) => {
  let filter;
  let filterRef;
  let filterCode;
  try {
    filter = params?.value;
    filterCode = params?.value?.code;
    if (
      lodash.isEmpty(filter)
    ) {
      const MESSAGE = 'Missing required params.value parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(filterCode)) {
      const MESSAGE = 'Missing required params.value.code parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getDatasourceByContext(context);
    appendAuditInfo(context, filter);
    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const RET_VAL = await DATASOURCE.filters.saveOne(context, params);

    const CHANGES_SERVICE_PARAMS = {
      value: RET_VAL,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await ModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    await runtimeDataService.synchronizeWithConfigDirectoryLiveAnalyticsFiltersService(context, { value: RET_VAL });

    filterRef = RET_VAL?.ref;
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.SAVE_LIVE_ANALYTICS_FILTER, { ref: filterRef });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${saveOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
