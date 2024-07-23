/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `${require('../../package.json').name}-comilator-compile-one`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const requireFromString = require('require-from-string');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { decodeObjectBase64Attribute } = require('@ibm-aca/aca-utils-codec');

const compileOne = async (params) => {
  try {
    if (
      lodash.isEmpty(params)
    ) {
      const MESSAGE = 'Required parameters was not found';
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
      appendDataToError(ACA_ERROR, { params });
      logger.error(compileOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
    decodeObjectBase64Attribute(params, 'code');
    const CODE = params?.code;
    if (
      lodash.isEmpty(CODE)
    ) {
      const MESSAGE = "Required parameter 'module.code' was not found";
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
      appendDataToError(ACA_ERROR, { params });
      logger.error(compileOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
    const RET_VAL = await requireFromString(CODE);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(compileOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


module.exports = {
  compileOne,
}
