/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-doc-validation-express-routes-controllers-doc-validation-v1-validate-one`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { throwAcaError, ACA_ERROR_TYPE, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { docValidationV1Service } = require('@ibm-aca/aca-doc-validation-service');

const validateOne = async (request, response) => {
  const ERRORS = [];
  let context;
  let params;
  let result;
  try {
    context = request?.body?.context;
    params = request?.body?.params;
    if (
      lodash.isEmpty(params?.document)
    ) {
      const MESSAGE = `Missing required request.body.document parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await docValidationV1Service.validateOne(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(validateOne.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  validateOne,
}
