/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-answers-datasource-mongo-answer-stores-find-one-by-key';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregatePipeline } = require('./aggregate-pipeline');

const findOneByKey = async (datasource, context, params) => {

  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.answerStores;

  const PARAMS_KEY = params?.key;
  const PARAMS_ASSISTANT_ID = params?.assistantId;

  let pipeline;
  try {
    if (
      lodash.isEmpty(PARAMS_KEY)
    ) {
      const MESSAGE = 'Missing required params.key attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(PARAMS_ASSISTANT_ID)
    ) {
      const MESSAGE = 'Missing required params.assistantId attribute!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    pipeline = aggregatePipeline(context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline
      });

    const RET_VAL = ramda.pathOr({}, [0, 'answers'], RESPONSE);
    const ANSWER_VALUES = ramda.path(['values'], RET_VAL);
    if (
      lodash.isObject(RET_VAL) &&
      lodash.isEmpty(ANSWER_VALUES)
    ) {
      RET_VAL.values = [];
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(findOneByKey.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findOneByKey
}
