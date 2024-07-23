/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-catalogs-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { getDatasourceByContext } = require('../datasource.utils');

const runtimeDataService = require('../runtime-data');

const { findOneById } = require('./find-one-by-id');

const {
  ACTION_STATUSES,
  ACTION_TYPES,
  saveOne: saveAction,
} = require('../actions');

const __sanitizeCreateFields = async (context, params) => {
  const USER_ID = ramda.path(['user', 'id'], context);
  const CATALOG = ramda.path(['catalog'], params);
  const CATALOG_ID = ramda.path(['id'], CATALOG);
  if (
    lodash.isEmpty(CATALOG)
  ) {
    const MESSAGE = 'Missing params.catalog required attribute!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
  }
  let isNew = false;
  if (
    lodash.isEmpty(CATALOG_ID)
  ) {
    isNew = true;
  } else {
    const TMP_CATALOG = await findOneById(context, { id: CATALOG_ID });
    if (
      lodash.isEmpty(TMP_CATALOG)
    ) {
      isNew = true;
    }
  }
  if (isNew) {
    CATALOG.created = new Date();
    CATALOG.createdBy = USER_ID;
  }
}

const __sanitizeUpdateFields = (context, params) => {
  const USER_ID = ramda.path(['user', 'id'], context);
  const CATALOG = ramda.path(['catalog'], params);
  if (
    !lodash.isEmpty(CATALOG)
  ) {
    CATALOG.updated = new Date();
    CATALOG.updatedBy = USER_ID;
  }
}

const saveOne = async (context, params) => {
  let action;
  try {
    const DATASOURCE = getDatasourceByContext(context);

    await __sanitizeCreateFields(context, params);
    __sanitizeUpdateFields(context, params);

    const RET_VAL = await DATASOURCE.catalogs.saveOne(context, params);

    action = {
      id: RET_VAL?.id,
      status: ACTION_STATUSES.IDLE,
      type: ACTION_TYPES.CATALOG_NEW,
    }
    await saveAction(context, { action });

    await runtimeDataService.synchronizeWithConfigDirectoryCatalog(context, { catalog: RET_VAL })

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
