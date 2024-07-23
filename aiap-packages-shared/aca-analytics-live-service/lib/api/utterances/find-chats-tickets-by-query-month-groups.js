/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-utterances-find-chats-tickets-by-query-month-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const mergeTicketsAndChats = (response) => {
  const CHATS = response[0];
  const TICKETS = response[1];
  const CONCAT_CHATS_AND_TICKETS = lodash.concat(CHATS, TICKETS);
  const RESULT = [];
  for (let value of CONCAT_CHATS_AND_TICKETS) {
    let index = RESULT.findIndex(resultObject => resultObject.month === value.month && resultObject.year === value.year)
    if (index === -1) {
      RESULT.push(value);
    }
    else {
      RESULT[index].count += value.count;
    }
  }
  return RESULT;
}

const findChatsTicketsByQueryMonthGroups = async (context, params) => {
  try {
    const PROMISES = [];
    const DATASOURCE = getDatasourceByContext(context);
    PROMISES.push(DATASOURCE.utterances.findChatsByQueryMonthGroups(context, params));
    PROMISES.push(DATASOURCE.utterances.findChatsTicketsByQueryMonthGroups(context, params))
    const RESPONSE = await Promise.all(PROMISES);
    const RET_VAL = mergeTicketsAndChats(RESPONSE);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findChatsTicketsByQueryMonthGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findChatsTicketsByQueryMonthGroups,
}
