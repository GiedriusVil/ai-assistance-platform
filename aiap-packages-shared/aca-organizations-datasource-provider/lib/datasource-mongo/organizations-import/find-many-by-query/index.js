/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo-organizations-import-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { getOrganizationsImportCollectionName } = require('../../../utils');

const { aggregateQuery } = require('./aggregate-query');
const { formatResponse } = require('./format-response');

const findManyByQuery = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const COLLECTION = getOrganizationsImportCollectionName(context);

  let query;
  try {
    query = aggregateQuery(params);
    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT.
      __aggregateToArray(context, {
        collection: COLLECTION,
        pipeline: query,
      });

    const RESULT = RESPONSE[0];
    const ITEMS = RESULT?.items || [];
    const TOTAL = RESULT?.total || ITEMS?.length;
    const RET_VAL = {
      items: formatResponse(ITEMS),
      total: TOTAL
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${findManyByQuery.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findManyByQuery
}
