/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-metrics-utterances-transfers-percentage-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');
const { roundNumber } = require('../number.utils');

const _calcTransfersPercentage = (conversationsCount, utterancesTransfersCount) => {
  let transfersPercentage = 0;

  if (conversationsCount > 0) {
    transfersPercentage = roundNumber((utterancesTransfersCount / conversationsCount) * 100, 1);
  }
  return transfersPercentage;
}

const utterancesTransfersPercentageByQuery = async (context, params) => {
  let value;
  try {
    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [];
    PROMISES.push(DATASOURCE.conversations.countByQuery(context, params));
    PROMISES.push(DATASOURCE.utterances.countTransfersByQuery(context, params));
    const PROMISES_RESULT = await Promise.all(PROMISES);

    value = _calcTransfersPercentage(
      PROMISES_RESULT[0],
      PROMISES_RESULT[1],
    );

    const RET_VAL = { value };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(utterancesTransfersPercentageByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  utterancesTransfersPercentageByQuery,
}
