/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-filters-executor-compilator-compile-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const requireFromString = require('require-from-string');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const { decodeAttributeWithBase64 } = require('../utils');

const compileOne = async (params) => {
  try {
    if (lodash.isEmpty(params)) {
      const MESSAGE = 'Missing required params parameter!';
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
      appendDataToError(ACA_ERROR, { params });
      logger.error(compileOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
    decodeAttributeWithBase64(params, 'code');
    const CODE = params?.code;
    if (lodash.isEmpty(CODE)) {
      const MESSAGE = 'Missing required params.code parameter!';
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, MESSAGE);
      appendDataToError(ACA_ERROR, { params });
      logger.error(compileOne.name, { ACA_ERROR });
      throw ACA_ERROR;
    }

    const RET_VAL = await requireFromString(CODE);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(compileOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  compileOne,
}
