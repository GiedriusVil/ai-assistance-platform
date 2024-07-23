/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-oauth2-service-oauth2-tokens-access-decode-and-validate-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { decodeOne } = require('./decode-one');

const { calculateTokenExpiryLengthMS } = require('../../utils');

const decodeAndValidateOne = (context, params) => {
  let retVal;
  try {
    retVal = decodeOne(context, params);
    const TOKEN_ACCESS_VALID_LENGTH_MS = calculateTokenExpiryLengthMS(context, { token: retVal });
    if (
      TOKEN_ACCESS_VALID_LENGTH_MS <= 0
    ) {
      const ERROR_MESSAGE = `Provided Token Access is invalid!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHENTICATION_ERROR, ERROR_MESSAGE);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(decodeAndValidateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  decodeAndValidateOne,
}
