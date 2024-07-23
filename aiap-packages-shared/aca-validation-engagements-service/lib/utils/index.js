/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-service-utils-index';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { decode, ACA_CODEC_DECODE_TYPES } = require('@ibm-aca/aca-utils-codec');
const requireFromString = require('require-from-string');

const decodeAndInitialiseEngagement = async (context, params) => {
  let retVal;
  let schemaDecoded;
  try {
    if (
      lodash.isEmpty(params?.engagement?.schema?.value)
    ) {
      const ERROR_MESSAGE = `Missing required params?.engagement?.schema?.value attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isString(params?.engagement?.schema?.value)
    ) {
      const ERROR_MESSAGE = `Wrong type of params?.engagement?.schema?.value attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    schemaDecoded = decode({
      type: ACA_CODEC_DECODE_TYPES.BASE64_2_STRING,
      input: params?.engagement?.schema?.value,
    })
    retVal = requireFromString(schemaDecoded)
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(decodeAndInitialiseEngagement.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  decodeAndInitialiseEngagement,
}
