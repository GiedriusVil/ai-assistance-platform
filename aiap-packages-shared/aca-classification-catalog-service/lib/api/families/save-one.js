/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-families-save-one';
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
    const PARAMS_CATALOG_ID = params?.family?.catalogId;
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.families.saveOne(context, params);

    action = {
      id: RET_VAL?.id,
      catalogId: PARAMS_CATALOG_ID,
      type: ACTION_TYPES.FAMILY_SAVE,
      status: ACTION_STATUSES.IDLE
    }

    await saveAction(context, { action });

    await runtimeDataService.synchronizeWithConfigDirectoryFamily(context, { family: RET_VAL });

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
