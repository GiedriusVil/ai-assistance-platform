/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-datasource-mongo-audits-transactions-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { aggregateQuery, distinctQuery } = require('./aggregate-query');

const transactionsByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.audits;

  let pipeline;
  try {
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();

    const DISTINCT_QUERY = distinctQuery(context, params);
    const DOCUMENT_IDS = await ACA_MONGO_CLIENT.
      __distinct(context, {
        collection: COLLECTION,
        key: 'docExtId',
        filter: DISTINCT_QUERY,
      });

    const REQUESTS = [];

    for (const DOCUMENT_ID of DOCUMENT_IDS) {
      const PARAMS = ramda.mergeDeepLeft({
        filter: {
          docExtId: DOCUMENT_ID,
        }
      }, params);

      const PIPELINE = aggregateQuery(context, PARAMS);
      REQUESTS.push(
        ACA_MONGO_CLIENT.
          __aggregateToArray(context, {
            collection: COLLECTION,
            pipeline: PIPELINE,
          })
      )
    }

    const RET_VAL = (await Promise.all(REQUESTS)).flatMap(data => data);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, pipeline });
    logger.error(`${transactionsByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  transactionsByQuery,
}
