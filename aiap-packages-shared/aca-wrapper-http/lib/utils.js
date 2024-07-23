/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-wrapper-http-utils';

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const __isValidUrl = (url) => {
  const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
  let retVal = false;
  try {
    new URL(url);
    retVal = true;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${__isValidUrl.name}`, { ACA_ERROR });
  }
  return retVal;
};

const validateParams = (params) => {
  const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
  if (
    !lodash.isObject(params)
  ) {
    const MESSAGE = `Wrong type of input parameter params! [Expected -> Object]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params });
  }
  if (
    lodash.isEmpty(params.url)
  ) {
    const MESSAGE = `Missing required params.url parameter!`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params });
  }
  if (
    !lodash.isString(params.url)
  ) {
    const MESSAGE = `Wrong type of input parameter params.url! [Expected -> String]`;
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params });
  }
  if (
    !__isValidUrl(params.url)
  ) {
    const MESSAGE = 'Provided params.url value is invalid!';
    throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { params });
  }
};

const appendQueryParamsToUrl = (params) => {
  const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
  try {
    if (
      lodash.isEmpty(params?.queryParams) ||
      !lodash.isObject(params?.queryParams)
    ) {
      return params?.url;
    }
    const PARSED_URL = new URL(params?.url);
    for (const [KEY, VALUE] of Object.entries(params?.queryParams)) {
      PARSED_URL.searchParams.append(KEY, VALUE);
    }
    return PARSED_URL.toString();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(`${appendQueryParamsToUrl.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  validateParams,
  appendQueryParamsToUrl,
};
