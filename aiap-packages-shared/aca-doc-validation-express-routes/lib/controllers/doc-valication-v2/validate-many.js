/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-doc-validation-express-routes-controllers-doc-validation-v2-validate-many`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { docValidationV2Service } = require('@ibm-aca/aca-doc-validation-service');

const validateMany = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let documents;
  let result;
  try {
    context = request?.body?.context;
    contextUserId = context?.user?.id;
    documents = request?.body?.documents;
    if (
      lodash.isEmpty(documents)
    ) {
      const MESSAGE = `Missing required request.body.documents parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isArray(documents)
    ) {
      const MESSAGE = `Wrong type of request.body.documents parameter! [Expected: Array]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await docValidationV2Service.validateMany(context, { documents });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId, documents });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(validateMany.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  validateMany,
}
