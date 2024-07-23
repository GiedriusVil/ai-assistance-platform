/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-metrics-utterances-false-positive-percentage-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');
const { roundNumber } = require('../number.utils');

const _calcFalsePositivePercentage = (utterancesCount, actionNeededCount, falsePositiveCount) => {
  const DIFFERENCE = utterancesCount - actionNeededCount - falsePositiveCount;
  let percentageDifference = 0;

  if (DIFFERENCE > 0) {
    percentageDifference = roundNumber((DIFFERENCE * 100) / utterancesCount, 1);
  }
  return percentageDifference;
}

const utterancesFalsePositivePercentageByQuery = async (context, params) => {
  let value;
  try {
    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [];
    params.excludeEmptyMessage = true;
    params.options = {
      isSystemMessagesVisible: false,
    }

    PROMISES.push(DATASOURCE.utterances.countByQuery(context, params));
    PROMISES.push(DATASOURCE.utterances.countByQueryActionNeeded(context, params));
    PROMISES.push(DATASOURCE.utterances.countByQueryFalsePositive(context, params));

    const PROMISES_RESULT = await Promise.all(PROMISES);

    value = _calcFalsePositivePercentage(
      PROMISES_RESULT[0],
      PROMISES_RESULT[1],
      PROMISES_RESULT[2],
    );

    const RET_VAL = { value };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(utterancesFalsePositivePercentageByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  utterancesFalsePositivePercentageByQuery,
}
