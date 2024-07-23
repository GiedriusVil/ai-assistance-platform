/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-filters-executor-utils-error-logger';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const logErrorToDatabase = async (params, filter, error) => {
  logger.info(`${logErrorToDatabase.name}`, { params, filter, error });
  // TO_DO possibly log errors to audit db
}

module.exports = {
  logErrorToDatabase,
}
