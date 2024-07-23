/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rule-actions-datasource-mongo-actions-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');

const { formatResponse } = require('./format-response');

const findManyByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  const COLLECTION = datasource._collections.actions;

  let pipeline;
  try {
    pipeline = aggregateQuery(params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: pipeline,
      });

    const RESULT = ramda.path([0], RESPONSE);
    const RESULT_ITEMS = RESULT?.items;
    const RESULT_TOTAL = RESULT?.total;

    const ITEMS = formatResponse(RESULT_ITEMS);

    const RET_VAL = { items: ITEMS, total: ITEMS.length };
    if (
      RESULT_TOTAL > 0
    ) {
      RET_VAL.total = RESULT_TOTAL;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(`${findManyByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery,
}
