/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const TOKEN_REFRESH_EXPIRY_LENGTH_MS = 1000 * 60 * 60;
const TOKEN_ACCESS_EXPIRY_LENGTH_MS = 1000 * 60;

const TOKEN_REFRESH_STATUS = {
  CREATED: 'CREATED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
}

const calculateTokenExpiryLengthMS = (context, params) => {
  let retVal = 0;
  try {
    if (
      lodash.isEmpty(params?.token)
    ) {
      const ERROR_MESSAGE = `Missing required params.token parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    const DATE_CURRENT = new Date();
    const DATE_CREATED = lodash.isString(params?.token?.created?.date) ? new Date(params?.token?.created?.date) : params?.token?.created?.date;
    if (
      !lodash.isNumber(params?.token?.expiryLengthMs) &&
      !params?.token?.expiryLengthMs > 0
    ) {
      const ERROR_MESSAGE = `Parameter params?.token?.expiryLengthMs has to be positive number!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    retVal = params?.token?.expiryLengthMs - (DATE_CURRENT - DATE_CREATED);
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(calculateTokenExpiryLengthMS.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const constructTokenIdForMemoryStore = (context, params) => {
  let retVal;
  try {
    if (
      lodash.isEmpty(params?.token?.id)
    ) {
      const ERROR_MESSAGE = `Missing required params?.token?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    if (
      lodash.isEmpty(params?.token?.id)
    ) {
      const ERROR_MESSAGE = `Missing required params?.token?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE)
    }
    retVal = `oauth2-token-access:${context?.user?.session?.tenant?.id}:${params?.token?.id}`;
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(constructTokenIdForMemoryStore.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  TOKEN_REFRESH_EXPIRY_LENGTH_MS,
  TOKEN_ACCESS_EXPIRY_LENGTH_MS,
  TOKEN_REFRESH_STATUS,
  calculateTokenExpiryLengthMS,
  constructTokenIdForMemoryStore,
}
