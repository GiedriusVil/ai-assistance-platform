
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-topic-modeling-datasource-mongo-models-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { v4: uuidv4 } = require('uuid');

const { throwAcaError, appendDataToError, formatIntoAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { findOneById } = require('./find-one-by-id');

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.topicModels;
  const TOPIC_MODEL = params?.topicModel;
  const MODEL_ID = ramda.pathOr(uuidv4(), ['id'], TOPIC_MODEL);
  let filter;
  let updateCondition;
  let updateOptions;
  try {
    if (
      lodash.isEmpty(TOPIC_MODEL)
    ) {
      const MESSAGE = `Missing required params.model paramater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      validator.isUUID(MODEL_ID) ||
      validator.isAlphanumeric(MODEL_ID, 'en-US', { ignore: '$_-' })
    ) {
      filter = { _id: { $eq: MODEL_ID } };
    } else {
      const ERROR_MESSAGE = `Id is invalid!`
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    delete TOPIC_MODEL.id;
    updateCondition = { $set: TOPIC_MODEL };
    updateOptions = { upsert: true };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: updateCondition,
          options: updateOptions
        });

    const RET_VAL = await findOneById(datasource, context, { id: MODEL_ID });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, updateCondition, updateOptions });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  saveOne
}
