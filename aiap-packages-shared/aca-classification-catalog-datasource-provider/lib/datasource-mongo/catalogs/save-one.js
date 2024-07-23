
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-catalogs-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { v4: uuid4 } = require('uuid');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructUnsetOption } = require('@ibm-aiap/aiap-utils-mongo');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_CATALOG = params?.catalog;
  const PARAMS_CATALOG_ID = params?.catalog?.id;

  let isNew = false;
  let catalogId;
  let filter = {};
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(PARAMS_CATALOG_ID)
    ) {
      isNew = true;
      catalogId = uuid4();
    } else {
      catalogId = PARAMS_CATALOG_ID;
    }

    if (
      validator.isUUID(catalogId) ||
      validator.isAlphanumeric(catalogId, 'en-US', { ignore: '$_-' })
    ) {
      filter = { _id: { $eq: catalogId } };
    } else {
      const ERROR_MESSAGE = `Id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    updateOptions = { upsert: true };
    updateCondition = {};
    if (
      !isNew
    ) {
      const PERSISTED_CATALOG = await findOneById(datasource, context, { id: catalogId });
      const UNSET_OPTION = constructUnsetOption(PERSISTED_CATALOG, PARAMS_CATALOG);
      if (
        !lodash.isEmpty(UNSET_OPTION)
      ) {
        updateCondition.$unset = UNSET_OPTION;
      }
    }
    updateCondition.$set = PARAMS_CATALOG;
    delete PARAMS_CATALOG.id;
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: datasource._collections.catalogs,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: catalogId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
