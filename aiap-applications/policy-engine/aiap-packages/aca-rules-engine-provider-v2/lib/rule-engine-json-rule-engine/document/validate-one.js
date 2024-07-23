/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-v2-json-rule-engine-document-validate-one'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const validateOne = async (engine, context, params) => {
  let document;
  try {
    document = params?.document;
    if (
      lodash.isEmpty(document)
    ) {
      const ERROR_MESSAGE = `Missing required params.document attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const RET_VAL = await engine.run({ document });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { document })
    logger.error(validateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  validateOne,
}
