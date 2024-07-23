/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-service-models-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { 
  appendAuditInfo, 
  calcDiffByValue 
} = require('@ibm-aiap/aiap-utils-audit');

const {
  CHANGE_ACTION,
} = require('@ibm-aiap/aiap--types-server');

const { getDatasourceByContext } = require('../datasource.utils');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const runtimeDataService = require('../runtime-data');

const { findOneById } = require('./find-one-by-id');
const classifierModelsChangesService = require('../classifier-models-changes');

const saveOne = async (context, params) => {
  try {
    appendAuditInfo(context, params?.value);
    const DIFFERENCES = await calcDiffByValue(context, {
      service: {
        findOneById,
      },
      value: params?.value,
    });

    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.classifier.saveOne(context, params);

    const CHANGES_SERVICE_PARAMS = {
      value: RET_VAL,
      docChanges: DIFFERENCES,
      action: CHANGE_ACTION.SAVE_ONE,
    };

    await runtimeDataService.synchronizeWithConfigDirectoryClassifierModel(context, { value: RET_VAL });

    await classifierModelsChangesService.saveOne(context, CHANGES_SERVICE_PARAMS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
