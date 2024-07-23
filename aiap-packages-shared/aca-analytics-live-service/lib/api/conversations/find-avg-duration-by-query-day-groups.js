/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-analytics-live-service-conversations-find-avg-duration-by-query-day-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getDatasourceByContext } = require('../datasource.utils');

const findAvgDurationByQueryDayGroups = async (context, params) => {
  try {
    const DATASOURCE = getDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.conversations.findAvgDurationByQueryDayGroups(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findAvgDurationByQueryDayGroups.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  findAvgDurationByQueryDayGroups,
}
