/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-express-routes-controller-classifier-models-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const {
  throwAcaError,
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  appendContextToError
} = require('@ibm-aca/aca-utils-errors');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');

const { classifierService } = require('@ibm-aca/aca-classifier-service');

const saveOne = async (request, response) => {
  const ERRORS = [];

  let context;
  let params;

  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    const REQUEST_BODY_VALUE = request?.body?.value;
    if (
      lodash.isEmpty(REQUEST_BODY_VALUE)
    ) {
      const MESSAGE = `Missing required request?.body?.value parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    params = { value: REQUEST_BODY_VALUE };
    retVal = await classifierService.saveOne(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendContextToError(ACA_ERROR, context);
    appendDataToError(ACA_ERROR, { params });
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(retVal);
  } else {
    logger.error(saveOne.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  saveOne,
}
