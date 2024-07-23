/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-metrics-utterances-transfers-count-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const utterancesTransfersCountByQuery = async (context, params) => {
  let value;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    value = await DATASOURCE.utterances.countTransfersByQuery(context, params);
    const RET_VAL = { value };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(utterancesTransfersCountByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  utterancesTransfersCountByQuery,
}
