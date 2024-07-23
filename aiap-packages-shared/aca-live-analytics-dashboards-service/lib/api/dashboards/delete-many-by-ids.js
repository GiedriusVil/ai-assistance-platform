/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-dashboards-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const {
  appendAuditInfo,
} = require('@ibm-aiap/aiap-utils-audit');

const {
  CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const ModelsChangesService = require('../models-changes');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const retrieveRefsByIds = async (context, ids) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const PROMISES = [];
    for (let id of ids) {
      PROMISES.push(await DATASOURCE.dashboards.findOneById(context, { id: id }));
    }
    const RESULT = await Promise.all(PROMISES);
    const RET_VAL = RESULT.map(f => {return f?.ref})
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
    const RET_VAL = await DATASOURCE.dashboards.deleteManyByIds(context, params);

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

    await runtimeDataService.deleteManyByIdsFromDirectoryLiveAnalyticsDashboardsService(context, { ids: REFS });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
