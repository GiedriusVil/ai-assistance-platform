/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-messages-find-transfer-totals-by-query-hour-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaAnalyticsLiveDatasourceByContext } = require('@ibm-aca/aca-analytics-live-datasource-provider');

const findTransferTotalsByQueryHourGroups = async (context, params) => {
  try {
    const DATASOURCE = getAcaAnalyticsLiveDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.messages.findTransferTotalsByQueryHourGroups(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  findTransferTotalsByQueryHourGroups,
}
