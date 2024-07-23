/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-engine-provider-json-rule-engine-requisition-validate'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { formatValidation } = require('./format-validation');

const validateOne = async (engine, context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let document;
  let documentId;

  let validationRaw;
  let validation;

  try {
    document = params?.document;
    documentId = document?.id;
    if (
      lodash.isEmpty(document)
    ) {
      const MESSAGE = `Missing required params.document parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(documentId)
    ) {
      const MESSAGE = `Missing required params.document.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    validationRaw = await engine.run({ document });
    validation = await formatValidation(context, document, validationRaw);
    const RET_VAL = {
      id: documentId,
      validation: validation
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(`${validateOne.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  validateOne,
}
