
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'answers-datasource-mongo-answer-stores-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.answerStores;

  const PARAMS_ANSWER_STORE = params?.answerStore;
  const PARAMS_ANSWER_STORE_ID = params?.answerStore?.id;

  let answerStoreId;
  let filter = {};
  let updateCondition;
  let updateOptions;
  try {
    answerStoreId = lodash.isEmpty(PARAMS_ANSWER_STORE_ID) ? uuidv4() : PARAMS_ANSWER_STORE_ID;
    updateCondition = { $set: PARAMS_ANSWER_STORE };
    updateOptions = { upsert: true };

    if (
      validator.isUUID(MODULE_ID) ||
      validator.isAlphanumeric(MODULE_ID, 'en-US', { ignore: '$_-' })
    ) {
      filter = { _id: { $eq: answerStoreId } };
    } else {
      const ERROR_MESSAGE = `Id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions,
        });

    const RET_VAL = await findOneById(datasource, context, { id: answerStoreId });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
