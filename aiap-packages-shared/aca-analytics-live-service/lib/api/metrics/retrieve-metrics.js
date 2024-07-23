/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-metrics-retrieve-metrics';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('ramda');

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

const _calcFalsePositivePercentage = (utterancesCount, actionNeededCount, falsePositiveCount) => {
  const DIFFERENCE = utterancesCount - actionNeededCount - falsePositiveCount;
  let percentageDifference = 0;

  if (DIFFERENCE > 0) {
    percentageDifference = roundNumber((DIFFERENCE * 100) / utterancesCount, 1);
  }
  return percentageDifference;
}

const _calcFalsePositivePercentageMessages = (messagesCount, actionNeededCount, falsePositiveCount) => {
  const DIFFERENCE = messagesCount - actionNeededCount - falsePositiveCount;
  let percentageDifference = 0;

  if (DIFFERENCE > 0) {
    percentageDifference = roundNumber((DIFFERENCE * 100) / messagesCount, 1);
  }
  return percentageDifference;
}

const retrieveMetrics = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);

    const PROMISES = [];

    PROMISES.push(DATASOURCE.conversations.countByQuery(context, params));

    PROMISES.push(DATASOURCE.utterances.countByQuery(context, params));
    PROMISES.push(DATASOURCE.utterances.avgPerConversationByQuery(context, params));
    PROMISES.push(DATASOURCE.utterances.countByQueryActionNeeded(context, params));
    PROMISES.push(DATASOURCE.utterances.countByQueryFalsePositive(context, params));
    PROMISES.push(DATASOURCE.utterances.countTransfersByQuery(context, params));

    PROMISES.push(DATASOURCE.messages.countByQuery(context, params));
    PROMISES.push(DATASOURCE.messages.countByQueryActionNeeded(context, params));
    PROMISES.push(DATASOURCE.messages.countByQueryFalsePositive(context, params));

    const PROMISES_RESULT = await Promise.all(PROMISES);

    const RET_VAL = {
      conversations: {
        total: ramda.pathOr(0, [0], PROMISES_RESULT),
      },
      utterances: {
        total: ramda.pathOr(0, [1], PROMISES_RESULT),
        avgPerConv: ramda.pathOr(0, [2], PROMISES_RESULT),
        actionNeeded: ramda.pathOr(0, [3], PROMISES_RESULT),
        falsePositive: {
          total: ramda.pathOr(0, [4], PROMISES_RESULT),
        },
        transfers: {
          total: ramda.pathOr(0, [5], PROMISES_RESULT),
        },
      },
      messages: {
        total: ramda.pathOr(0, [6], PROMISES_RESULT),
        actionNeeded: ramda.pathOr(0, [7], PROMISES_RESULT),
        falsePositive: {
          total: ramda.pathOr(0, [8], PROMISES_RESULT),
        }
      }
    };

    RET_VAL.utterances.transfers.percentage = _calcTransfersPercentage(
      RET_VAL?.conversations?.total,
      RET_VAL?.utterances?.transfers?.total,
    );

    RET_VAL.utterances.falsePositive.percentage = _calcFalsePositivePercentage(
      RET_VAL?.conversations?.total,
      RET_VAL?.utterances?.actionsNeeded,
      RET_VAL?.utterances?.falsePositive?.total,
    );

    RET_VAL.messages.falsePositive.percentage = _calcFalsePositivePercentageMessages(
      RET_VAL.messages?.total,
      RET_VAL.messages?.actionNeeded,
      RET_VAL.messages?.falsePositive?.total,
    );

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveMetrics.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  retrieveMetrics,
}
