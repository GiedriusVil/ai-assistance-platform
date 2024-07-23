/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-datasource-mongo-classification-rules-conditions-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { v4: uuidv4 } = require('uuid');

const { appendDataToError, formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.rulesConditions;

  const PARAMS_VALUE = params?.value;
  const PARAMS_VALUE_ID = params?.value?.id;

  let valueId;

  let filter;
  let updateCondition;
  let updateOptions;

  try {
    if (lodash.isEmpty(PARAMS_VALUE)) {
      const MESSAGE = `Missing required params.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    valueId = lodash.isEmpty(PARAMS_VALUE_ID) ? uuidv4() : PARAMS_VALUE_ID;

    delete PARAMS_VALUE.id;

    filter = { _id: valueId }
    updateCondition = { $set: PARAMS_VALUE };
    updateOptions = { upsert: true };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: valueId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, updateCondition, updateOptions });
    logger.error(`${saveOne.name}`, { errors: ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne,
}
