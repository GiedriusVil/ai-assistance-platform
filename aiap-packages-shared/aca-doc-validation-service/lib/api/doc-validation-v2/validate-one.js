/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-service-doc-validation-v2-validate-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const validator = require('validator');

const {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const { CoachStopWatch } = require('@ibm-aca/aca-performance-manager');
const {
  executeEnrichedByLambdaModule,
} = require('@ibm-aca/aca-lambda-modules-executor');

const ERR_L_MODULE_MISSING = () => throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, `Unable to retrieve ${MODULE_ID} L-module!`);

const validateOne = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  let document;
  let documentId;
  try {
    document = params?.document;
    documentId = document?.id;
    if (
      lodash.isEmpty(document)
    ) {
      const ERROR_MESSAGE = `Missing required params.document parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(documentId)
    ) {
      const ERROR_MESSAGE = `Missing required params.document.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !validator.isMongoId(documentId) &&
      !validator.isAlphanumeric(documentId, 'en-US', { ignore: '_-' })
    ) {
      const ERROR_MESSAGE = 'Required parameter params.document.id is invalid!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    const COACH_STOP_WATCH = CoachStopWatch.getInstance(documentId).start();
    const RET_VAL = await executeEnrichedByLambdaModule(
      MODULE_ID,
      ERR_L_MODULE_MISSING,
      context,
      params,
    );
    COACH_STOP_WATCH.stopAndDestroy(RET_VAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, document });
    logger.error(validateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  validateOne,
};
