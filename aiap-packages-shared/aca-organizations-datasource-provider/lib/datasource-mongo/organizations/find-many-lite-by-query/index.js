/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo-organizations-find-many-lite-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');
const { formatResponse } = require('./format-response');

const findManyLiteByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.organizations;

  let query;
  try {
    query = aggregateQuery(params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const ITEMS = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(ITEMS.length, ['total'], RESULT);
    const RET_VAL = {
      items: formatResponse(ITEMS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${findManyLiteByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyLiteByQuery
}
