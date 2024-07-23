/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-v2-json-rule-engine-document-validate-many'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

// const DEFAULT_LANGUAGE = 'en-gb';

const validateMany = async (engine, context, params) => {
  try {


    const RET_VAL = null;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { document })
    logger.error(validateMany.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  validateMany,
}
