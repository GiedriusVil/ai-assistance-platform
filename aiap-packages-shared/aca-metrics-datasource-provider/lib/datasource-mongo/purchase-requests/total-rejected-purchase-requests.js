/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-datasource-provider-purchase-requests-total-rejected';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const {
  matchFieldBetween2Dates,
  matchAttributeBuyerOrganizationIdByIds,
} = require('@ibm-aiap/aiap-utils-mongo');

const headerValidationsNotEmpty = () => {
  const RET_VAL = {};
  RET_VAL['doc.headerValidations'] = {
    $not: {
      $size: 0
    }
  };
  return RET_VAL;
}

const linesValidationsNotEmpty = () => {
  const RET_VAL = {};
  RET_VAL['doc.linesValidations'] = {
    $not: {
      $size: 0
    }
  };
  return RET_VAL;
}

const totalRejectedPRs = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_FILTER = params?.filter;
  const COLLECTION = datasource._collections.purchaseRequests;
  let query;
  let key;
  try {
    key = 'doc.documentId';
    query = {
      $and: [
        { action: 'RESPONSE_TRANSFORMED' },
        {
          $or: [
            matchFieldBetween2Dates('timestamp', PARAMS_FILTER),
            matchFieldBetween2Dates('created.date', PARAMS_FILTER),
          ]
        },
        matchAttributeBuyerOrganizationIdByIds(PARAMS_FILTER),
        {
          $or: [
            headerValidationsNotEmpty(),
            linesValidationsNotEmpty(),
          ]
        }
      ]
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
    logger.error(`${totalRejectedPRs.name}`, { ACA_ERROR });
    throw error;
  }
}

module.exports = {
  totalRejectedPRs
}
