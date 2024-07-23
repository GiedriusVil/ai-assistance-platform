/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-gw-validation-service-validation-v1-validate-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
} = require('@ibm-aca/aca-utils-errors');

const {
  executeEnrichedByLambdaModule,
} = require('@ibm-aca/aca-lambda-modules-executor');

const ERR_LAMBDA_MODULE_MISSING = () => throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, `Missing lambda-module -> ${MODULE_ID}`);

const validateOne = async (context, params) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const RET_VAL = await executeEnrichedByLambdaModule(
      MODULE_ID,
      ERR_LAMBDA_MODULE_MISSING,
      context,
      params
    );
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(validateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  validateOne,
};
