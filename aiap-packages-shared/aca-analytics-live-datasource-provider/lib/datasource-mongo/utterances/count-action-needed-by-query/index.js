/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-analytics-live-datasource-provider-utterances-count-action-needed-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');

const countByQueryActionNeeded = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.utterances;

  let pipeline;
  try {
    pipeline = aggregateQuery(context, params);
    logger.info(countByQueryActionNeeded.name, { pipeline });

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const RET_VAL = ramda.pathOr(0, ['actionNeeded', 0, 'count'], RESULT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(countByQueryActionNeeded.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  countByQueryActionNeeded
}
