/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-service-queries-compile-one-get-application-url';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const BASE_URL_PATHS = {
  LIVE_ANALYTICS: 'liveAnalyticsBaseUrl',
}

const getApplicationUrl = (context, params) => {
  try {
    const RET_VAL = getBaseUrl(context, params, BASE_URL_PATHS.LIVE_ANALYTICS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getBaseUrl = (context, params, baseUrlPath) => {
  const HOSTNAME = context?.user?.session?.tenant[baseUrlPath];
  if (lodash.isEmpty(HOSTNAME)) {
    const ACA_ERROR = formatIntoAcaError(
      MODULE_ID,
      `${baseUrlPath} was not found!`);
    logger.error('->', { ACA_ERROR, params });
    appendDataToError(ACA_ERROR, { basePathError: true });
    return ACA_ERROR;
  }
  return `${HOSTNAME}/api/v1/live-analytics/health-check/compile-query`;
}

module.exports = {
  getApplicationUrl
}
