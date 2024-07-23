/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-service-models-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { 
  appendAuditInfo,
} = require('@ibm-aiap/aiap-utils-audit');

const {
  CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const runtimeDataService = require('../runtime-data');

const classifierModelsChangesService = require('../classifier-models-changes');

const deleteManyByIds = async (context, params) => {
  try {
    const IDS = params?.ids;

    if (
      lodash.isEmpty(IDS)
    ) {
      const MESSAGE = `Missing required params.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.classifier.deleteManyByIds(context, params);

    console.log('-->', IDS);
    const CHANGES_PROMISES = IDS.map((id) => {
      const VALUE = {
        id: id,
      };
      appendAuditInfo(context, VALUE);
      const CHANGES_SERVICE_PARAMS = {
        value: VALUE,
        action: CHANGE_ACTION.DELETE_MANY_BY_IDS,
      };
      return classifierModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);
    });

    await Promise.all(CHANGES_PROMISES);

    await runtimeDataService.deleteManyByIdsFromDirectoryClassifierModel(context, params);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  deleteManyByIds,
}
