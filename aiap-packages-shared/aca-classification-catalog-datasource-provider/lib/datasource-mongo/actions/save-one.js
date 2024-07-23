
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo-actions-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { v4: uuid4 } = require('uuid');

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { constructUnsetOption } = require('@ibm-aiap/aiap-utils-mongo');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_ACTION = params?.action;
  const PARAMS_ACTION_ID = params?.action?.id;

  let isNew = false;
  let actionId;
  let filter;
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(PARAMS_ACTION_ID)
    ) {
      isNew = true;
      actionId = uuid4();
    } else {
      actionId = PARAMS_ACTION_ID;
    }
    filter = { _id: actionId };

    updateOptions = { upsert: true };
    updateCondition = {};
    if (
      !isNew
    ) {
      const PERSISTED_ACTION = await findOneById(datasource, context, { id: PARAMS_ACTION_ID });
      const UNSET_OPTION = constructUnsetOption(PERSISTED_ACTION, PARAMS_ACTION);
      if (
        !lodash.isEmpty(UNSET_OPTION)
      ) {
        updateCondition.$unset = UNSET_OPTION;
      }
    }
    updateCondition.$set = PARAMS_ACTION;

    delete PARAMS_ACTION.id;

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: datasource._collections.actions,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_ACTION, filter, updateCondition, updateOptions });
    logger.error('saveOne', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
