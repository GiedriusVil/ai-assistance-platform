/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-filters-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  appendAuditInfo,
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

const ModelsChangesService = require('../models-changes');

const publishDeleteEvents = (context, refs) => {
  try {
    if (
      !lodash.isEmpty(refs) &&
      lodash.isArray(refs)
    ) {
      for (let ref of refs) {
        getEventStreamByContext(context).publish(AIAP_EVENT_TYPE.DELETE_LIVE_ANALYTICS_FILTER, { ref });
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(publishDeleteEvents.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const retrieveRefsByIds = async (context, ids) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const PROMISES = [];
    for (let id of ids) {
      PROMISES.push(await DATASOURCE.filters.findOneById(context, { id: id }));
    }
    const RESULT = await Promise.all(PROMISES);
    const RET_VAL = RESULT.map(f => { return f?.ref })
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveRefsByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const deleteManyByIds = async (context, params) => {
  let ids;
  try {
    ids = params?.ids;
    if (
        lodash.isEmpty(ids)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getDatasourceByContext(context);
    const REFS = await retrieveRefsByIds(context, ids);
    const RET_VAL = await DATASOURCE.filters.deleteManyByIds(context, params);

    const CHANGES_PROMISES = ids.map((id) => {
      const VALUE = {
        id: id,
      };
      appendAuditInfo(context, VALUE);
      const CHANGES_SERVICE_PARAMS = {
        value: VALUE,
        action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
      };
      return ModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);
    });

    await Promise.all(CHANGES_PROMISES);

    await runtimeDataService.deleteManyByIdsFromDirectoryLiveAnalyticsFiltersService(context, { ids: REFS });

    publishDeleteEvents(context, REFS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  deleteManyByIds,
}
