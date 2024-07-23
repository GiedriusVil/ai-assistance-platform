/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-metrics-messages-avg-per-conversation-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');
const { roundNumber } = require('../number.utils');

const messagesAvgPerConversationsByQuery = async (context, params) => {
  let value;
  try {
    const DATASOURCE = getDatasourceByContext(context);
    value = await DATASOURCE.messages.avgPerConversationByQuery(context, params);
    value = roundNumber(value, 2);
    const RET_VAL = { value };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(messagesAvgPerConversationsByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  messagesAvgPerConversationsByQuery,
}
