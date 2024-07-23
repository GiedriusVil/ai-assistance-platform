/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-datasource-provider-v2-datasource-mongo-rules-channges-v2-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');
const { formatResponse } = require('./format-response');

const findManyByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let query;
  try {
    query = aggregateQuery(context, params);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
    __aggregateToArray(context, {
      collection: datasource._collections.rulesChangesV2,
      pipeline: query,
    });

    const RESULT = ramda.pathOr({}, [0], RESPONSE);
    const RULES_V2 = ramda.pathOr([], ['items'], RESULT);
    const TOTAL = ramda.pathOr(RULES_V2.length, ['total'], RESULT);
    const RET_VAL = {
      items: formatResponse(RULES_V2),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findManyByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery
}
