/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-queries-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  calcDiffByValue
} = require('@ibm-aiap/aiap-utils-audit');

const {
  CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError,
} = require('@ibm-aca/aca-utils-errors');

const { appendAuditInfo } = require('@ibm-aiap/aiap-utils-audit');

const {
  AIAP_EVENT_TYPE,
  getEventStreamByContext,
} = require('@ibm-aiap/aiap-event-stream-provider');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const { findOneById } = require('./find-one-by-id');
const ModelsChangesService = require('../models-changes');

const saveOne = async (context, params) => {
  let query;
  let queryCode;
  let queryRef;
  try {
    query = params?.value;
    queryCode = params?.value?.code;
    if (
      lodash.isEmpty(query)
    ) {
      const MESSAGE = 'Missing required params.value parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(queryCode)) {
      const MESSAGE = 'Missing required params.value.code parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getDatasourceByContext(context);
    appendAuditInfo(context, query);
    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const RET_VAL = await DATASOURCE.queries.saveOne(context, params);

    const CHANGES_SERVICE_PARAMS = {
      value: RET_VAL,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await runtimeDataService.synchronizeWithConfigDirectoryQuery(context, { value: RET_VAL });

    await ModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    queryRef = RET_VAL?.ref;
    getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.SAVE_LIVE_ANALYTICS_QUERY, { ref: queryRef });
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
