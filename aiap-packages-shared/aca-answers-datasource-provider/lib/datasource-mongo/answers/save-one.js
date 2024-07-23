
/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'anwers-datasource-mongo-answers-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { pullAllByKey } = require('./pull-all-by-key');

const _pushOne = async (datasource, context, filter, answer) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const COLLECTION = datasource._collections.answerStores;
    const PUSH_CONDITION = {
      $push: {
        answers: answer
      }
    }

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    await ACA_MONGO_CLIENT
      .__updateOne(context,
        {
          collection: COLLECTION,
          filter: filter,
          update: PUSH_CONDITION
        });

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, filter, answer });
    logger.error(_pushOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const saveOne = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const PARAMS_ANSWER_STORE_ID = params?.answerStoreId;
  const PARAMS_ANSWER = params?.answer;

  _ensureLegacyStructure(PARAMS_ANSWER);

  let filter;
  try {
    if (
      lodash.isEmpty(PARAMS_ANSWER)
    ) {
      const MESSAGE = 'Missing mandatory params.answer attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }

    if (
      !validator.isMongoId(PARAMS_ANSWER_STORE_ID) &&
      !validator.isAlphanumeric(PARAMS_ANSWER_STORE_ID, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = `Wrong type params.answerStoreId parameter! [Expected - MongoId]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: {
        $eq: PARAMS_ANSWER_STORE_ID
      }
    };
    await pullAllByKey(datasource, context, filter, PARAMS_ANSWER);
    await _pushOne(datasource, context, filter, PARAMS_ANSWER);
    const RET_VAL = PARAMS_ANSWER;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter });
    logger.error(saveOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _ensureLegacyStructure = (answer) => {
  if (
    !lodash.isEmpty(answer?.values) &&
    lodash.isArray(answer?.values)
  ) {
    answer.values.forEach(value => {
      if (
        lodash.isEmpty(value?.text) &&
        value?.type === 'TEXT'
      ) {
        value.text = value?.output?.text;
      }
    });
  }
}

module.exports = {
  saveOne
}
