/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-datasource-provider-purchase-requests-total-rejected-validations';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');

const totalRejectedValidations = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.purchaseRequests;

  let query;
  try {
    query = aggregateQuery(context, params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const QUERY_RESULT = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });
    const RET_VAL = ramda.pathOr(0, ['0', 'total'], QUERY_RESULT);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${totalRejectedValidations.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
    totalRejectedValidations
}
