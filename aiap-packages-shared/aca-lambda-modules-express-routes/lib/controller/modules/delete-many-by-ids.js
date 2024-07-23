/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-lambda-modules-express-routes-controller-modules-delete-one-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
  appendContextToError,
} = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { lambdaModulesService } = require('@ibm-aiap/aiap-lambda-modules-service');

const deleteManyByIds = async (request, response) => {
  const ERRORS = [];

  let context;
  let params;

  let result;
  try {
    context = constructActionContextFromRequest(request);
    const REQUEST_BODY_IDS = request?.body?.ids;
    if (
      lodash.isEmpty(REQUEST_BODY_IDS)
    ) {
      const ERROR_MESSAGE = `Missing required request?.body?.ids parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isArray(REQUEST_BODY_IDS)
    ) {
      const ERROR_MESSAGE = `Wrong type of required request?.body?.ids parameter! Expected Array.`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    params = {
      ids: REQUEST_BODY_IDS,
    }
    result = await lambdaModulesService.deleteManyByIds(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendContextToError(ACA_ERROR, context);
    appendDataToError(ACA_ERROR, { params })
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(deleteManyByIds.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  deleteManyByIds,
};
