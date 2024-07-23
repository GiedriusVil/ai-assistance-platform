/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-validation-engagements-express-routes-controller-validation-engagements-delete-many-by-keys';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');
const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { validationEngagementsService } = require('@ibm-aca/aca-validation-engagements-service');

const deleteManyByKeys = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const ENGAGEMENT_KEYS = request?.body?.keys;
  const PARAMS = { keys: ENGAGEMENT_KEYS };
  let result;
  try {
    if (
      lodash.isEmpty(ENGAGEMENT_KEYS)
    ) {
      const MESSAGE = `Missing required request.body.keys parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    result = await validationEngagementsService.deleteManyByKeys(CONTEXT, PARAMS);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ACA_ERROR.params = PARAMS;
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error(deleteManyByKeys.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

module.exports = {
  deleteManyByKeys,
};
