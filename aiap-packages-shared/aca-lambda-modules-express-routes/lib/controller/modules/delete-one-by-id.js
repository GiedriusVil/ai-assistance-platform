/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-modules-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  appendDataToError,
  appendContextToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { lambdaModulesService } = require('@ibm-aiap/aiap-lambda-modules-service');

const deleteOneById = async (request, response) => {
  const ERRORS = [];

  let context;
  let params;

  let result;
  try {
    context = constructActionContextFromRequest(request);
    const REQUEST_BODY_ID = request?.body?.id;

    if (
      lodash.isEmpty(REQUEST_BODY_ID)
    ) {
      const ERROR_MESSAGE = `Missing required request?.body?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    params = {
      ids: REQUEST_BODY_ID,
    }

    result = await lambdaModulesService.deleteOneById(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendContextToError(ACA_ERROR, context);
    appendDataToError(ACA_ERROR, { params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(deleteOneById.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};


module.exports = {
  deleteOneById,
};
