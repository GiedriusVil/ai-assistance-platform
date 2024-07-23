/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'answers-datasource-mongo-answers-find-answers-by-module-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');

const findManyByActionTagId = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.answerStores;

  const MODULE_ID = params?.moduleId;

  let query;
  try {
    if (
      lodash.isEmpty(MODULE_ID)
    ) {
      const MESSAGE = `Missing required params.moduleId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    query = aggregateQuery(context, params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query
      });
    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const ANSWERS = ramda.pathOr([], ['answers'], RESULT);
    return ANSWERS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findManyByActionTagId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByActionTagId
}
