/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-entities-find-error-message-by-query-month-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const findErrorMessageByQueryMonthGroups = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.usageByGroup.findErrorMessageByQueryMonthGroups(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findErrorMessageByQueryMonthGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findErrorMessageByQueryMonthGroups,
}
