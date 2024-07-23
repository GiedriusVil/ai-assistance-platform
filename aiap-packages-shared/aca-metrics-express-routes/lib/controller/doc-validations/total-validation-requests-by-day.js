/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-express-routes-controller-doc-validations-total-validation-requests-by-day';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const { docValidationsMetricsService } = require('@ibm-aca/aca-metrics-service');

const totalValidationRequestsByDay = async (request, response) => {
  const ERRORS = [];
  let context;
  let contextUserId;
  let params;

  let result = {};
  try {
    context = request?.acaContext;
    contextUserId = context?.user?.id;
    params = request?.body;
    if (
      lodash.isEmpty(context)
    ) {
      const MESSAGE = `Missing required request.acaContext parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params)
    ) {
      const MESSAGE = `Missing required request.body parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await docValidationsMetricsService.totalValidationRequestsByDay(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { contextUserId });
    ERRORS.push({ ACA_ERROR });
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  }else {
    logger.error(`${totalValidationRequestsByDay.name}`, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  totalValidationRequestsByDay,
};
