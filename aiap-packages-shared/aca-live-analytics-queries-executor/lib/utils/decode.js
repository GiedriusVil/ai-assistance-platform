/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-queries-executor-utils-decode';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');

const _isBase64 = (value) => {
  const RET_VAL = Buffer.from(value, 'base64').toString('base64') === value;
  return RET_VAL;
}

const decodeAttributeWithBase64 = (object, attribute) => {
  const ERRORS = [];

  try {
    if (!lodash.isObject(object)) {
      const MESSAGE = 'Provided input parameter object is not a object!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    let value = object?.[attribute];
    if (
      !lodash.isEmpty(value) &&
      lodash.isString(value) &&
      _isBase64(value)
    ) {
      object[attribute] = Buffer.from(value, 'base64').toString('utf-8');
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
    logger.error(decodeAttributeWithBase64.name, { ERRORS });
  }
}

module.exports = {
  decodeAttributeWithBase64
}
