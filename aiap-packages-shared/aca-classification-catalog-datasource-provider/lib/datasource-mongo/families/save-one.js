
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-families-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { v4: uuid4 } = require('uuid');

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { constructUnsetOption } = require('@ibm-aiap/aiap-utils-mongo');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_FAMILY = params?.family;
  const PARAMS_FAMILY_ID = params?.family?.id;

  let isNew = false;
  let familyId;
  let filter;
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(PARAMS_FAMILY_ID)
    ) {
      isNew = true;
      familyId = uuid4();
    } else {
      familyId = PARAMS_FAMILY_ID;
    }
    filter = { _id: familyId };
    updateOptions = { upsert: true };
    updateCondition = {};
    if (
      !isNew
    ) {
      const PERSISTED_FAMILY = await findOneById(datasource, context, { id: familyId });
      const UNSET_OPTION = constructUnsetOption(PERSISTED_FAMILY, PARAMS_FAMILY);
      if (
        !lodash.isEmpty(UNSET_OPTION)
      ) {
        updateCondition.$unset = UNSET_OPTION;
      }
    }
    updateCondition.$set = PARAMS_FAMILY;
    delete PARAMS_FAMILY.id;
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: datasource._collections.families,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: familyId });
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
