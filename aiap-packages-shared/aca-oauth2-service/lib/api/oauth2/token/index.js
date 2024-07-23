/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-token';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { tokenByApiKey } = require('./token-by-api-key');
const { tokenByTokenRefresh } = require('./token-by-token-refresh');

const token = async (context, params) => {
  let retVal;
  try {
    if (
      !lodash.isEmpty(params?.apiKey)
    ) {
      retVal = await tokenByApiKey(context, params);
    } else if (
      !lodash.isEmpty(params?.tokenRefresh)
    ) {
      retVal = await tokenByTokenRefresh(context, params);
    } else {
      const ERROR_MESSAGE = `Please provide apiKey or tokenRefresh attributes value!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(token.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  token,
}
