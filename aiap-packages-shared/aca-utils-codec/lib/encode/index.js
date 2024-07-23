/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-codec-encode`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { ACA_CODEC_ENCODE_TYPES } = require('../types');

const { fromStringToBase64 } = require('./from-string-2-base64');

// [LEGO] - > Need 2 thing about async decode options.... There are some algorythms which take their time...
const encode = (params) => {
  const PARAMS_TYPE = params?.type;
  const PARAMS_INPUT = params?.input;

  let retVal;
  try {
    switch (PARAMS_TYPE) {
      case ACA_CODEC_ENCODE_TYPES.STRING_2_BASE64:
        {
          retVal = fromStringToBase64(PARAMS_INPUT);
          break;
        }
      default:
        {
          logger.info('DO_STUFF', { PARAMS_INPUT });
          break;
        }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
}

module.exports = {
  encode,
}
