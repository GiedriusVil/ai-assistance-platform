/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-codec-decode-from-base64-2-string`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

// [LEGO] - > Need 2 think about async decode options.... There are some algorythms which take their time...

const fromBase64ToString = (params) => {
  const INPUT = params?.input;
  try {
    if (
      lodash.isEmpty(INPUT)
    ) {
      const MESSAGE = `Missing required params.input parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const BUFFER = Buffer.from(INPUT, 'base64');
    const DATA_AS_STRING = BUFFER.toString('utf-8');
    return DATA_AS_STRING;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(fromBase64ToString.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  fromBase64ToString,
}
