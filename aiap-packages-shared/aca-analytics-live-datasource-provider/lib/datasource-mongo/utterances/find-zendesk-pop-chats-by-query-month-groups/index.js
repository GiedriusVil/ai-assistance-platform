/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-datasource-provider-utterances-find-zendesk-pop-chats-by-query-month-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const lodash = require('@ibm-aca/aca-wrapper-lodash');
const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { getDataFromCSV } = require('@ibm-aiap/aiap-utils-mongo');


// TODO -> LEGO -> Abril -> move this to service level!
const findZendeskPOPChatsByQueryMonthGroups = async (datasource, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const CSV_PATH = __dirname;
  const CSV_NAME = 'pop-chats-data.csv';
  const CSV_DELIMITER = ';';
  const CSV_INDEX = 2;
  let query;

  let dateRangeFrom;
  let dateRangeTo;
  try {
    query = params?.query;
    dateRangeFrom = params?.query?.filter?.dateRange?.from;
    dateRangeTo = params?.query?.filter?.dateRange?.to;
    if (
      !lodash.isDate(dateRangeFrom)
    ) {
      const ERROR_MESSAGE = `Wrong type of params?.query?.filter?.dateRange?.from parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isDate(dateRangeTo)
    ) {
      const ERROR_MESSAGE = `Wrong type of params?.query?.filter?.dateRange?.from parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const RET_VAL = getDataFromCSV(dateRangeFrom, dateRangeTo, CSV_PATH, CSV_NAME, CSV_DELIMITER, CSV_INDEX).then(function (monthsDataset) {
      return monthsDataset;
    });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, query });
    logger.error(findZendeskPOPChatsByQueryMonthGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findZendeskPOPChatsByQueryMonthGroups
}
