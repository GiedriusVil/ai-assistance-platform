/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-sub-classes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const {
  ACTION_STATUSES,
  ACTION_TYPES,
  saveOne: saveAction,
} = require('../actions');

const saveOne = async (context, params) => {
  let action;
  try {
    const PARAMS_CATALOG_ID = params?.subClass?.catalogId;
    let paramsSubClassId = params?.subClass?.id;
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.subClasses.saveOne(context, params);
    if (lodash.isEmpty(paramsSubClassId)) {
      paramsSubClassId = ramda.path(['result', 'upserted', 0, '_id'], RET_VAL);
    }
    action = {
      id: paramsSubClassId,
      catalogId: PARAMS_CATALOG_ID,
      status: ACTION_STATUSES.IDLE,
      type: ACTION_TYPES.SUB_CLASS_SAVE,
    }
    await saveAction(context, { action: action });

    await runtimeDataService.synchronizeWithConfigDirectorySubClass(context, { subClass: RET_VAL });

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
