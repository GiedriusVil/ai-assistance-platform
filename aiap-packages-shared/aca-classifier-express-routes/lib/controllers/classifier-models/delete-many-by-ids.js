/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classifier-express-routes-controller-classifier-models-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { throwAcaError, ACA_ERROR_TYPE, appendDataToError, formatIntoAcaError, appendContextToError } = require('@ibm-aca/aca-utils-errors');
const { classifierService } = require('@ibm-aca/aca-classifier-service');

const deleteManyByIds = async (request, response) => {
  const ERRORS = [];

  let context;
  let params;

  let retVal;
  try {
    context = constructActionContextFromRequest(request);
    const REQUEST_BODY_IDS = request?.body?.ids;
    if (
      lodash.isEmpty(REQUEST_BODY_IDS)
    ) {
      const MESSAGE = `Missing required request?.body?.ids parameter`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    params = { ids: REQUEST_BODY_IDS };
    retVal = await classifierService.deleteManyByIds(context, params);
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
    logger.error(deleteManyByIds.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}

module.exports = {
  deleteManyByIds,
}
