/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-datasource-mongo-purchase-requests-unique-buyers';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
  matchFieldBetween2Dates,
  matchAttributeBuyerOrganizationIdByIds,
} = require('@ibm-aiap/aiap-utils-mongo');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const uniqueBuyers = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_FILTER = params?.filter;
  const COLLECTION = datasource._collections.purchaseRequests;
  let query;
  let key;
  try {
    key = 'doc.document.client.id';
    query = {
      action: 'REQUEST_TRANSFORMED',
      $or: [
        matchFieldBetween2Dates('timestamp', PARAMS_FILTER),
        matchFieldBetween2Dates('created.date', PARAMS_FILTER),
      ],
      ...matchAttributeBuyerOrganizationIdByIds(PARAMS_FILTER),
    };

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RET_VAL = await ACA_MONGO_CLIENT
      .__distinct(context, {
        collection: COLLECTION,
        key: key,
        filter: query,
      });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(`${uniqueBuyers.name}`, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  uniqueBuyers,
}
