/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-dashboards-configurations-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { appendDataToError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { aggregateQuery } = require('./aggregate-query');
const { formatResponse } = require('./format-response');

const findManyByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = datasource._collections.dashboardsConfigurations;

  let query;
  try {
    query = aggregateQuery(context, params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESULT = await ACA_MONGO_CLIENT.__aggregateToArray(context, {
      collection: COLLECTION,
      pipeline: query
    });
    const TOTAL = RESULT.length;
    const RET_VAL = {
      items: formatResponse(RESULT),
      total: TOTAL
    };
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
