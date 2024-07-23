/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `${require('../../package.json').name}-decode`
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { ACA_CODEC_DECODE_TYPES } = require('../types');

const { fromBase64ToString } = require('./from-base64-2-string');

const _isBase64 = (value) => {
  const RET_VAL = Buffer.from(value, 'base64').toString('base64') === value;
  return RET_VAL;
}

// [LEGO] - > Need 2 thing about async decode options.... There are some algorythms which take their time...
const decode = (params) => {
  const PARAMS_TYPE = params?.type;
  const PARAMS_INPUT = params?.input;
  let retVal;
  try {
    switch (PARAMS_TYPE) {
      case ACA_CODEC_DECODE_TYPES.BASE64_2_STRING:
        {
          retVal = fromBase64ToString(params);
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
    logger.error(decode.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const decodeObjectBase64Attribute = (object, attribute) => {
  try {
    if (
      !lodash.isObject(object)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: `Provided input parameter object is not a object!`
      };
      throw ACA_ERROR;
    }
    let value = ramda.path([attribute], object);
    if (
      !lodash.isEmpty(value) &&
      lodash.isString(value) &&
      _isBase64(value)
    ) {
      object[attribute] = Buffer.from(value, 'base64').toString('utf-8');
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(decodeObjectBase64Attribute.name, { ACA_ERROR });
  }
}

module.exports = {
  decode,
  decodeObjectBase64Attribute,
  fromBase64ToString,
}
