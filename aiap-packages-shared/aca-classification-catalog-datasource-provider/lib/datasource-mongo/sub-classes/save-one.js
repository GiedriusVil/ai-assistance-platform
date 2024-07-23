
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-sub-classes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { v4: uuid4 } = require('uuid');

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { constructUnsetOption } = require('@ibm-aiap/aiap-utils-mongo');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.subClasses;

  const PARAMS_SUB_CLASS = params?.subClass;
  const PARAMS_SUB_CLASS_ID = params?.subClass?.id;

  let isNew = false;
  let id;
  let filter;
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(PARAMS_SUB_CLASS_ID)
    ) {
      isNew = true;
      id = uuid4();
    } else {
      id = PARAMS_SUB_CLASS_ID;
    }
    filter = { _id: id };
    updateOptions = { upsert: true };
    updateCondition = {};
    if (
      !isNew
    ) {
      const PERSISTED_SUB_CLASS = await findOneById(datasource, context, { id: id });
      const UNSET_OPTION = constructUnsetOption(PERSISTED_SUB_CLASS, PARAMS_SUB_CLASS);
      if (
        !lodash.isEmpty(UNSET_OPTION)
      ) {
        updateCondition.$unset = UNSET_OPTION;
      }
    }
    updateCondition.$set = PARAMS_SUB_CLASS;
    delete PARAMS_SUB_CLASS.id;
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: id });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, updateCondition });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
